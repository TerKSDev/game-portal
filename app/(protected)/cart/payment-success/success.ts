"use server";

import { auth } from "@/lib/actions/auth";
import prisma from "@/lib/prisma";
import Stripe from "stripe";

import { GetGamePrice } from "@/lib/game";

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

    await prisma.$transaction(async (tx) => {
      // Deduct Orbs if used
      if (orbsUsed > 0) {
        const currentUser = await tx.user.findUnique({
          where: { id: userId },
          select: { orbs: true },
        });

        if (currentUser && currentUser.orbs >= orbsUsed) {
          await tx.user.update({
            where: { id: userId },
            data: { orbs: currentUser.orbs - orbsUsed },
          });
        }
      }

      for (const item of cartItem) {
        const price = await GetGamePrice(item.name);

        await tx.libraryItem.create({
          data: {
            userId: userId,
            gameId: item.gameId,
            gameUrl: item.gameUrl,
            name: item.name,
            image: item.image,
            purchasedPrice: price?.final || "Free",
          },
        });
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

    return { success: true, message: "Payment successful." };
  } catch (error) {
    console.log("Error: ", error);
    return {
      success: false,
      message: "Payment failed. Please try again later.",
    };
  }
}
