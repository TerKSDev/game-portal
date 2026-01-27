"use server";

import { signOut } from "@/lib/actions/auth";
import prisma from "@/lib/prisma";
import { PATHS } from "@/app/_config/routes";
import { auth } from "@/lib/actions/auth";

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
