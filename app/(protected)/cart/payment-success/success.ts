"use server";

import { auth } from "@/lib/actions/auth";
import prisma from "@/lib/prisma";
import Stripe from "stripe";
import { revalidatePath } from "next/cache";

import { GetGamePrice, type GamePriceProps } from "@/lib/game";
import { PATHS } from "@/app/_config/routes";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-01-28.clover",
});

export async function HandlePaymentSuccess(sessionId?: string | null) {
  const session = await auth();

  if (!session || !session.user || !session.user.id) {
    return;
  }

  const userId = session.user.id;

  try {
    // Get Orbs usage from Stripe session if available
    let orbsUsed = 0;
    if (sessionId) {
      try {
        const stripeSession =
          await stripe.checkout.sessions.retrieve(sessionId);
        orbsUsed = parseInt(stripeSession.metadata?.orbsUsed || "0");
      } catch (error) {
        console.log("Failed to retrieve Stripe session:", error);
      }
    }

    const cartItem = await prisma.cartItem.findMany({
      where: {
        userId: userId,
      },
    });

    if (cartItem.length === 0) {
      return { success: false, message: "Your cart is empty." };
    }

    // Fetch all prices OUTSIDE transaction to avoid timeout
    // This prevents external API calls from blocking database transaction
    const pricePromises = cartItem.map((item) => GetGamePrice(item.name));
    const prices = await Promise.all(pricePromises);

    // Create price map for quick lookup
    const priceMap = new Map<string, GamePriceProps | null>();
    cartItem.forEach((item, index) => {
      priceMap.set(item.name, prices[index]);
    });

    // Calculate total purchase amount for Orbs reward (original cart total)
    let totalPurchaseAmount = 0;
    for (const item of cartItem) {
      const price = priceMap.get(item.name);
      if (price?.final) {
        // Handle different price formats: "RM 50", "RM50", "50", "Free"
        const priceStr = price.final.toLowerCase();
        if (priceStr === "free" || priceStr === "0") {
          continue; // Free games don't count toward total
        }
        // Extract number from string (handles "RM 50", "RM50", "50.00")
        const priceValue = parseFloat(priceStr.replace(/[^\d.]/g, ""));
        if (!isNaN(priceValue) && priceValue > 0) {
          totalPurchaseAmount += priceValue;
        }
      }
    }

    // Now execute transaction quickly without external API calls
    await prisma.$transaction(async (tx) => {
      // Get current user's orbs
      const currentUser = await tx.user.findUnique({
        where: { id: userId },
        select: { orbs: true },
      });

      if (!currentUser) {
        throw new Error("User not found");
      }

      let updatedOrbs = currentUser.orbs;

      // Deduct Orbs if used (verify user has enough)
      if (orbsUsed > 0) {
        if (currentUser.orbs < orbsUsed) {
          throw new Error("Insufficient Orbs");
        }
        updatedOrbs = currentUser.orbs - orbsUsed;
      }

      // Add 5% Orbs reward only if NOT using Orbs for payment
      // Reward based on ORIGINAL total amount (before Orbs discount)
      if (orbsUsed === 0 && totalPurchaseAmount > 0) {
        const orbsReward = Math.floor(totalPurchaseAmount * 0.05 * 100);
        updatedOrbs += orbsReward;
      }

      // Update user's Orbs
      await tx.user.update({
        where: { id: userId },
        data: { orbs: updatedOrbs },
      });

      // Create transaction record for the purchase
      const cashAmount = totalPurchaseAmount - orbsUsed / 100;
      const gamesList = cartItem.map((item) => item.name).join(", ");

      await tx.transaction.create({
        data: {
          userId: userId,
          type: "Purchase",
          amount: orbsUsed, // Orbs used (if any)
          cashAmount: cashAmount > 0 ? cashAmount : null,
          description: `Purchased games: ${gamesList}`,
          status: "Success",
          stripeSessionId: sessionId || undefined,
        },
      });

      // Add items to library (check for duplicates)
      for (const item of cartItem) {
        const price = priceMap.get(item.name);

        // Check if game already exists in library
        const existingItem = await tx.libraryItem.findFirst({
          where: {
            userId: userId,
            gameId: item.gameId,
          },
        });

        // Only add if not already in library
        if (!existingItem) {
          // Calculate purchased price display
          let purchasedPrice = price?.final || "Free";

          // If used Orbs for payment, show actual cash paid + Orbs used
          if (orbsUsed > 0 && price?.final) {
            const priceValue = parseFloat(price.final.replace(/[^\d.]/g, ""));
            if (!isNaN(priceValue) && priceValue > 0) {
              // Calculate proportion of Orbs used for this item
              const itemProportion = priceValue / totalPurchaseAmount;
              const itemOrbsUsed = Math.round(orbsUsed * itemProportion);

              // Calculate cash discount from Orbs (100 Orbs = RM 1)
              const itemOrbsDiscount = itemOrbsUsed / 100;
              const actualCashPaid = priceValue - itemOrbsDiscount;

              // Format: "RM XX.XX + X,XXX Orbs"
              purchasedPrice = `RM ${actualCashPaid.toFixed(2)} + ${itemOrbsUsed.toLocaleString()} Orbs`;
            }
          }

          await tx.libraryItem.create({
            data: {
              userId: userId,
              gameId: item.gameId,
              gameUrl: item.gameUrl,
              name: item.name,
              image: item.image,
              purchasedPrice: purchasedPrice,
            },
          });
        }
      }

      const gameIds = cartItem.map((item) => item.gameId);

      await tx.wishlistItem.deleteMany({
        where: {
          userId: userId,
          gameId: {
            in: gameIds,
          },
        },
      });

      await tx.cartItem.deleteMany({
        where: {
          userId: userId,
        },
      });
    });

    // Revalidate paths to refresh UI
    revalidatePath(PATHS.CART);
    revalidatePath(PATHS.LIBRARY);
    revalidatePath(PATHS.WISHLIST);

    return { success: true, message: "Payment successful." };
  } catch (error) {
    console.log("Error: ", error);
    return {
      success: false,
      message: "Payment failed. Please try again later.",
    };
  }
}
