import { NextResponse } from "next/server";
import { auth } from "@/lib/actions/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();

    if (!session || !session.user?.id) {
      return NextResponse.json(
        { libraryCount: 0, wishlistCount: 0, cartCount: 0, balance: 0 },
        { status: 200 },
      );
    }

    const userId = session.user.id;

    // Get library count
    const libraryCount = await prisma.libraryItem.count({
      where: { userId },
    });

    // Get wishlist count
    const wishlistCount = await prisma.wishlistItem.count({
      where: { userId },
    });

    // Get cart count
    const cartCount = await prisma.cartItem.count({
      where: { userId },
    });

    // Get user balance (orbs)
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { orbs: true },
    });

    return NextResponse.json({
      libraryCount,
      wishlistCount,
      cartCount,
      balance: user?.orbs || 0,
    });
  } catch (error) {
    console.error("Error fetching user stats:", error);
    return NextResponse.json(
      { libraryCount: 0, wishlistCount: 0, cartCount: 0, balance: 0 },
      { status: 200 },
    );
  }
}
