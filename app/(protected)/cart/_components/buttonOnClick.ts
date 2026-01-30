"use server";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/actions/auth";
import { redirect } from "next/navigation";

import { PATHS } from "@/app/_config/routes";
import { revalidatePath } from "next/cache";

export async function RemoveFromCart(id: string) {
  const session = await auth();

  if (!session || !session.user || !session.user.id) {
    redirect(PATHS.LOGIN);
  }

  try {
    await prisma.cartItem.delete({
      where: {
        id: id,
      },
    });

    revalidatePath(PATHS.CART);
    return { success: true };
  } catch (error) {
    console.log(error);
    return { success: false };
  }
}

export async function HandleCheckout(orbsUsage: number) {
  const session = await auth();

  if (!session || !session.user || !session.user.id) {
    redirect(PATHS.LOGIN);
  }

  const userId = session.user.id;

  try {
    const currentUser = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        orbs: true,
      },
    });

    if (!currentUser || currentUser.orbs < orbsUsage) {
      return { success: false, message: "Insufficient orbs." };
    }

    // Get cart items
    const cartItems = await prisma.cartItem.findMany({
      where: {
        userId: userId,
      },
    });

    if (cartItems.length === 0) {
      return { success: false, message: "Your cart is empty." };
    }

    // Process payment with transaction
    await prisma.$transaction(async (tx) => {
      // Deduct orbs
      await tx.user.update({
        where: {
          id: userId,
        },
        data: {
          orbs: currentUser.orbs - orbsUsage,
        },
      });

      // Calculate orbs per item
      const totalOrbs = orbsUsage;
      const itemCount = cartItems.length;
      const orbsPerItem = Math.floor(totalOrbs / itemCount);

      // Add items to library
      for (let i = 0; i < cartItems.length; i++) {
        const item = cartItems[i];

        // Check if game already exists in library
        const existingItem = await tx.libraryItem.findFirst({
          where: {
            userId: userId,
            gameId: item.gameId,
          },
        });

        // Calculate orbs for this item (give remainder to last item)
        const isLastItem = i === cartItems.length - 1;
        const itemOrbs = isLastItem
          ? totalOrbs - orbsPerItem * (itemCount - 1)
          : orbsPerItem;

        // Only add if not already in library
        if (!existingItem) {
          await tx.libraryItem.create({
            data: {
              userId: userId,
              gameId: item.gameId,
              gameUrl: item.gameUrl,
              name: item.name,
              image: item.image,
              purchasedPrice: `${itemOrbs.toLocaleString()} Orbs`,
            },
          });
        }
      }

      // Remove from wishlist
      const gameIds = cartItems.map((item) => item.gameId);
      await tx.wishlistItem.deleteMany({
        where: {
          userId: userId,
          gameId: {
            in: gameIds,
          },
        },
      });

      // Clear cart
      await tx.cartItem.deleteMany({
        where: {
          userId: userId,
        },
      });
    });

    revalidatePath(PATHS.CART);
    revalidatePath(PATHS.LIBRARY);

    return { success: true };
  } catch (error) {
    console.log("Failed to pay with orbs: ", error);
    return { success: false, message: "Payment failed. Please try again." };
  }
}
