import prisma from "@/lib/prisma";
import Link from "next/link";
import { PATHS } from "@/app/_config/routes";
import { auth } from "@/lib/actions/auth";
import WishlistItem from "./_components/WishlistItem";
import { redirect } from "next/navigation";
import { FaStar } from "react-icons/fa";
import { GetGamePrice } from "@/lib/game";

export const metadata = {
  title: "Wishlist",
  description: "Your saved games and upcoming purchases.",
};

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

  const wishlistItem = await Promise.all(
    rawWishlist.map(async (item) => {
      const priceData = await GetGamePrice(item.name);
      return {
        ...item,
        isInCart: cartGameIds.has(item.gameId),
        addedAt: item.addedAt.toLocaleDateString(),
        price: priceData?.final || "N/A",
        isAddedToCart: cartGameIds.has(item.gameId),
      };
    }),
  );

  return (
    <div className="flex flex-1 flex-col pt-32 px-4 sm:px-6 lg:px-8 pb-12 min-h-screen">
      <div className="max-w-6xl mx-auto w-full">
        <h1 className="text-3xl font-bold mb-8 bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          My Wishlist
        </h1>
        <div className="flex flex-col gap-4">
          {wishlistItem.length > 0 ? (
            wishlistItem.map((item) => (
              <WishlistItem key={item.id} item={item} />
            ))
          ) : (
            <div className="flex items-center justify-center min-h-100">
              <div className="flex flex-col text-center justify-center items-center gap-8">
                <FaStar size={42} />
                <div className="gap-1.5">
                  <p className="text-gray-400 text-xl">
                    Your wishlist is empty
                  </p>
                  <p className="text-gray-500 text-sm">
                    Start adding games you love!
                  </p>
                </div>
                <Link
                  href={PATHS.STORE}
                  className="inline-block bg-linear-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 px-12 py-2 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-blue-500/50"
                >
                  Browse Store
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
