"use server";

import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { auth } from "@/lib/actions/auth";
import { PATHS } from "@/app/_config/routes";

export interface AddProps {
  game: {
    gameId: number;
    gameUrl: string;
    name: string;
    price: string;
    image: string;
  };
}

export async function AddToWishlist({ game }: AddProps) {
  const currentUser = await auth();

  if (!currentUser || !currentUser.user || !currentUser.user.id) {
    redirect(PATHS.LOGIN);
  }

  try {
    const wishtlist = await prisma.wishlistItem.findFirst({
      where: {
        gameId: game.gameId,
        userId: currentUser.user.id.toString(),
      },
    });

    if (!wishtlist) {
      await prisma.wishlistItem.create({
        data: {
          userId: currentUser.user.id.toString(),
          gameId: game.gameId,
          gameUrl: game.gameUrl,
          name: game.name,
          image: game.image,
        },
      });

      return { success: true };
    }

    await prisma.wishlistItem.delete({
      where: {
        id: wishtlist.id,
      },
    });

    return { success: false };
  } catch (error) {
    console.log("Error adding to wishlist: ", error);
    redirect(PATHS.LOGIN);
  }
}

export async function AddToCart({ game }: AddProps) {
  const currentUser = await auth();

  if (!currentUser || !currentUser.user || !currentUser.user.id) {
    redirect(PATHS.LOGIN);
  }

  const cart = await prisma.cartItem.findFirst({
    where: {
      gameId: game.gameId,
      userId: currentUser.user.id.toString(),
    },
  });

  if (!cart) {
    await prisma.cartItem.create({
      data: {
        userId: currentUser.user.id.toString(),
        gameId: game.gameId,
        gameUrl: game.gameUrl,
        name: game.name,
        image: game.image,
      },
    });

    return { success: true };
  }

  // Remove from cart
  await prisma.cartItem.delete({
    where: {
      id: cart.id,
    },
  });

  return { success: false };
}
