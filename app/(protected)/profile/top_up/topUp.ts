"use server";

import { auth } from "@/lib/actions/auth";
import prisma from "@/lib/prisma";

export async function topUpOrbs(orbsToAdd: number) {
  try {
    const session = await auth();

    if (!session || !session.user || !session.user.id) {
      return {
        success: false,
        error: "You must be logged in to top up orbs",
      };
    }

    if (orbsToAdd <= 0) {
      return {
        success: false,
        error: "Invalid amount",
      };
    }

    // Update user's orbs
    const updatedUser = await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        orbs: {
          increment: orbsToAdd,
        },
      },
    });

    // Create transaction record
    await prisma.transaction.create({
      data: {
        userId: session.user.id,
        amount: orbsToAdd,
        type: "Top_Up",
        status: "COMPLETED",
      },
    });

    return {
      success: true,
      newBalance: updatedUser.orbs,
    };
  } catch (error) {
    console.error("Top-up error:", error);
    return {
      success: false,
      error: "Failed to process top-up. Please try again.",
    };
  }
}
