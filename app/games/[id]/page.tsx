import Header from "@/app/components/Header";
import GameDetails from "./_components/GameDetails";
import prisma from "@/lib/prisma";
import { GetGameDetails } from "@/lib/game";
import { redirect } from "next/navigation";
import { auth } from "@/lib/actions/auth";

export interface GameDetailsProps {
  params: Promise<{ id: string }>;
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
    const wishlistItem = await prisma.wishlistItem.findFirst({
      where: {
        userId: session.user.id,
        gameId: gameData.game.id,
      },
    });

    const cartItem = await prisma.cartItem.findFirst({
      where: {
        userId: session.user.id,
        gameId: gameData.game.id,
      },
    });

    const libraryItem = await prisma.libraryItem.findFirst({
      where: {
        userId: session.user.id,
        gameId: gameData.game.id,
      },
    });

    if (libraryItem) {
      initialLibraryState = true;
    }

    initialWishlistState = !!wishlistItem;
    initialCartState = !!cartItem;
  }

  return (
    <div className="w-full min-h-screen text-white pt-32 px-4 sm:px-6 lg:px-8">
      <GameDetails
        key={`${gameData.game.id}-${gameData.game.name}-${gameData.game.publisher} `}
        game={gameData.game}
        price={gameData.price}
        cartInitialState={initialCartState}
        wishlistInitialState={initialWishlistState}
        libraryInitialState={initialLibraryState}
      />
    </div>
  );
}
