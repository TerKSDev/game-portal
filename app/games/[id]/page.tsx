import GameDetails from "./_components/GameDetails";
import prisma from "@/lib/prisma";
import { GetGameDetails } from "@/lib/game";
import { redirect } from "next/navigation";
import { auth } from "@/lib/actions/auth";
import type { Metadata } from "next";

export interface GameDetailsProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: GameDetailsProps): Promise<Metadata> {
  const { id } = await params;
  const gameData = await GetGameDetails(id);

  if (!gameData) {
    return {
      title: "Game Not Found",
      description: "The requested game could not be found.",
    };
  }

  const game = gameData.game;
  const description =
    game.short_description ||
    game.description ||
    "Discover this amazing game on Game Portal.";
  const truncatedDescription =
    description.length > 160
      ? description.substring(0, 157) + "..."
      : description;

  return {
    title: game.name,
    description: truncatedDescription,
    openGraph: {
      title: `${game.name} - Game Portal`,
      description: truncatedDescription,
      images: [
        {
          url: game.header_image || "/og-image.png",
          width: 1200,
          height: 630,
          alt: game.name,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${game.name} - Game Portal`,
      description: truncatedDescription,
      images: [game.header_image || "/og-image.png"],
    },
  };
}

export default async function Game({ params }: GameDetailsProps) {
  const { id } = await params;
  const gameData = await GetGameDetails(id);

  if (!gameData) {
    alert("Game data not found.");
    return redirect("/");
  }

  const session = await auth();
  let initialWishlistState = false;
  let initialCartState = false;
  let initialLibraryState = false;

  if (session?.user?.id) {
    // Parallel queries with error handling
    try {
      const [wishlistItem, cartItem, libraryItem] = await Promise.all([
        prisma.wishlistItem
          .findFirst({
            where: {
              userId: session.user.id,
              gameId: gameData.game.id,
            },
          })
          .catch((error) => {
            console.error("[Game Details] Wishlist query error:", error);
            return null;
          }),
        prisma.cartItem
          .findFirst({
            where: {
              userId: session.user.id,
              gameId: gameData.game.id,
            },
          })
          .catch((error) => {
            console.error("[Game Details] Cart query error:", error);
            return null;
          }),
        prisma.libraryItem
          .findFirst({
            where: {
              userId: session.user.id,
              gameId: gameData.game.id,
            },
          })
          .catch((error) => {
            console.error("[Game Details] Library query error:", error);
            return null;
          }),
      ]);

      initialWishlistState = !!wishlistItem;
      initialCartState = !!cartItem;
      initialLibraryState = !!libraryItem;
    } catch (error) {
      console.error("[Game Details] Error fetching user states:", error);
      // Continue with default states (all false) if queries fail
    }
  }

  return (
    <main className="flex flex-1 w-full min-h-screen justify-center px-4 sm:px-6 lg:px-8 py-8">
      <GameDetails
        key={`${gameData.game.id}-${gameData.game.name}-${gameData.game.publisher} `}
        game={gameData.game}
        price={gameData.price}
        cartInitialState={initialCartState}
        wishlistInitialState={initialWishlistState}
        libraryInitialState={initialLibraryState}
      />
    </main>
  );
}
