"use client";

import { useState, useEffect } from "react";
import { GetGames, GameProps } from "@/lib/game";

import GameCard from "./GameCard";

interface GameListProps {
  game: GameProps[];
  query?: string;
}

export default function GameList({ game, query = "" }: GameListProps) {
  const [games, setGames] = useState<GameProps[]>(game);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [pageCount, setPageCount] = useState(1);

  useEffect(() => {
    setGames(game);
    setPage(1);
    setPageCount(1);
  }, [game]);

  const handleMoreGames = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const nextPage = page + 1;
      const moreGames = await GetGames(nextPage, 24, query);

      if (moreGames.length !== 0) {
        setGames((previous) => [...previous, ...moreGames]);
        setPage(nextPage);
        setPageCount(pageCount + 1);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col">
      <div className="grid max-sm:flex max-sm:flex-col md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 pt-34 mx-auto gap-7">
        {games.map((game) => (
          <GameCard key={`${game.id}-${game.name}`} game={game} />
        ))}
      </div>

      <div className="flex flex-row w-full items-center font-bold text-lg gap-x-5 text-gray-300 group py-12 font-mono">
        <div className="border-t-2 flex flex-1 h-0 border-gray-400"></div>
        {pageCount <= 3 ? (
          <button
            disabled={loading}
            className="hover:underline hover:underline-offset-4 hover:text-white"
            onClick={handleMoreGames}
          >
            {loading ? "Loading..." : "Load More"}
          </button>
        ) : (
          <p>No game you want? Try searching for something else.</p>
        )}
        <div className="border-t-2 flex flex-1 h-0 border-gray-400"></div>
      </div>
    </div>
  );
}
