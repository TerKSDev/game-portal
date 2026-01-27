import prisma from "@/lib/prisma";
import Link from "next/link";
import { PATHS } from "@/app/_config/routes";
import { auth } from "@/lib/actions/auth";
import WishlistItem from "./_components/WishlistItem";
import { redirect } from "next/navigation";

export interface WishlistItemProps {
  id: string;
  name: string;
  userId: string;
  gameId: number;
  gameUrl: string;
  image: string;
  price: string;
  addedAt: string;
  isAddedToCart: boolean;
}

export default async function Wishlist() {
  const session = await auth();

  if (!session || !session.user || !session.user.id) {
    redirect(PATHS.LOGIN);
  }

  const userId = session?.user?.id;

  const [rawWishlist, rawCart] = await Promise.all([
    prisma.wishlistItem.findMany({
      where: {
        userId: userId,
      },
    }),
    prisma.cartItem.findMany({
      where: {
        userId: userId,
      },
      select: {
        gameId: true,
      },
    }),
  ]);

  const cartGameIds = new Set(rawCart.map((item) => item.gameId));

  const wishlistItem = rawWishlist.map((item) => ({
    ...item,
    isInCart: cartGameIds.has(item.gameId),
    addedAt: item.addedAt.toLocaleDateString(),
    price: item.price.toFixed(2).toString(),
    isAddedToCart: cartGameIds.has(item.gameId),
  }));

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 mt-23 p-8">
      {wishlistItem.length > 0 ? (
        wishlistItem.map((item) => (
          <WishlistItem key={item.id} item={item} />
        ))
      ) : (
        <div className="flex-1 flex flex-row gap-2 items-center my-72 font-mono">
          <p className="text-lg text-gray-400">No items in wishlist.</p>
          <Link
            href={PATHS.STORE}
            className="text-lg text-blue-400 hover:underline hover:underline-offset-4"
          >
            Add from store.
          </Link>
        </div>
      )}
    </div>
  );
}
