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
