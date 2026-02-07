import prisma from "@/lib/prisma";
import Link from "next/link";
import { PATHS } from "@/app/_config/routes";
import { auth } from "@/lib/actions/auth";
import WishlistItem from "./_components/WishlistItem";
import { redirect } from "next/navigation";
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
        addedAt: item.addedAt.toISOString(),
        price: priceData?.final || "N/A",
        isAddedToCart: cartGameIds.has(item.gameId),
      };
    }),
  );

  return (
    <main className="flex flex-1 w-full min-h-screen justify-center px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col w-full max-w-7xl gap-6">
        {/* Header Section */}
        <div className="relative">
          <h1 className="text-3xl sm:text-5xl font-black bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            My Wishlist
          </h1>
          <p className="text-zinc-500 mt-2 text-sm sm:text-base">
            {wishlistItem.length} {wishlistItem.length === 1 ? "item" : "items"}{" "}
            you're waiting for
          </p>
        </div>

        {/* Wishlist Items Grid */}
        <div className="grid grid-cols-1 gap-4">
          {wishlistItem.length > 0 ? (
            wishlistItem.map((item) => (
              <WishlistItem key={item.id} item={item} />
            ))
          ) : (
            <div className="flex items-center justify-center min-h-100 backdrop-blur-md border border-zinc-800/80 rounded-2xl p-12 mt-12">
              <div className="flex flex-col text-center justify-center items-center gap-6">
                <div className="text-6xl">❤️</div>
                <div className="space-y-2">
                  <p className="text-zinc-400 text-xl font-medium">
                    Your wishlist is empty
                  </p>
                  <p className="text-zinc-500 text-sm">
                    Start adding games you love!
                  </p>
                </div>
                <Link
                  href={PATHS.STORE}
                  className="inline-block bg-linear-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 px-8 py-3 rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-blue-500/50"
                >
                  Browse Store
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
