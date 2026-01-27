'use server';

import { auth } from "@/lib/actions/auth";
import prisma from "@/lib/prisma";

export async function FormSubmit() {
  const session = await auth();

  if (!session || !session.user || !session.user.id) {
    return;
  }

  const userId = session.user.id;

  try {
    const cartItem = await prisma.cartItem.findMany({
      where: {
        userId: userId,
      },
    });

    if (cartItem.length === 0) {
      return { success: false, message: "Your cart is empty." };
    }

    await prisma.$transaction(async (tx) => {
      for (const item of cartItem) {
        await tx.libraryItem.create({
          data: {
            userId: userId,
            gameId: item.gameId,
            gameUrl: item.gameUrl,
            name: item.name,
            image: item.image,
            purchasedPrice: item.price,
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
    return { success: false, message: "Payment failed. Please try again later." };
  }
}
