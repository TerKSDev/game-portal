"use server";

import { signOut } from "@/lib/actions/auth";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/actions/auth";
import { UserStatus } from "@/app/generated/prisma/enums";

export async function handleSignOut() {
  await signOut({ redirect: false });
}

export async function handleDeleteAccount() {
  const session = await auth();
  if (session?.user?.id) {
    await prisma.user.delete({
      where: {
        id: session?.user?.id,
      },
    });
    await signOut({ redirect: false });
  }
}

export async function handleChangeStatus(newStatus: string) {
  const session = await auth();
  if (session?.user?.id) {
    try {
      await prisma.user.update({
        where: {
          id: session.user.id,
        },
        data: {
          userStatus: newStatus as UserStatus,
        },
      });
    } catch (error) {
      console.error("Error updating status:", error);
    }
  }
}
