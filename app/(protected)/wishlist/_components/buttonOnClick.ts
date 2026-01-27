"use server";

import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { auth } from "@/lib/actions/auth";
import { PATHS } from "@/app/_config/routes";
import { revalidatePath } from "next/cache";
import { AddToCartProps } from "./Button";

export async function RemoveFromWishlist(itemId: string) {
  const session = await auth();

  if (!session || !session.user || !session.user.id) {
    redirect(PATHS.LOGIN);
  }

  try {
    const wishtlist = await prisma.wishlistItem.delete({
      where: {
        id: itemId,
        userId: session.user.id.toString(),
      },
    });
    revalidatePath(PATHS.WISHLIST);
    return { success: true };
  } catch (error) {
    console.log("Error remove from wishlist: ", error);
    return { success: false };
  }
}

export async function AddToCart({ itemDetails }: AddToCartProps) {
  const session = await auth();

  if (!session || !session.user || !session.user.id) {
    redirect(PATHS.LOGIN);
  }

  try {
    const wishtlist = await prisma.cartItem.create({
      data: {
        userId: session.user.id.toString(),
        gameId: itemDetails.gameId,
        gameUrl: itemDetails.gameUrl,
        name: itemDetails.name,
        price: itemDetails.price,
        image: itemDetails.image,
      },
    });
    revalidatePath(PATHS.WISHLIST);
    return { success: true };
  } catch (error) {
    console.log("Error add to cart: ", error);
    return { success: false };
  }
}
