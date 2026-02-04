"use client";

import { useState, useEffect } from "react";
import { GetGames, GameProps, GameFilters } from "@/lib/game";

import GameCard from "./GameCard";

interface GameListProps {
  game: GameProps[];
  query?: string;
  searchType?: "name" | "publisher";
  filters?: GameFilters;
}

export default function GameList({
  game,
  query = "",
  searchType = "name",
  filters,
}: GameListProps) {
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
      const moreGames = await GetGames(
        nextPage,
        24,
        query,
        searchType,
        filters,
      );

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
    <div className="flex flex-col w-full max-w-7xl">
      {games.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center px-4 mb-12">
          <div className="text-6xl mb-6">🔍</div>
          <h2 className="text-2xl font-bold text-gray-300 mb-2">
            No Games Found
          </h2>
          <p className="text-gray-500 text-center max-w-md">
            {query
              ? `No results found for "${query}". Try a different ${searchType === "publisher" ? "publisher" : "game name"}.`
              : "Start searching to discover amazing games!"}
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mx-auto w-full">
            {games.map((game) => (
              <GameCard key={`${game.id}-${game.name}`} game={game} />
            ))}
          </div>

          <div className="flex flex-row w-full items-center text-base gap-x-6 text-gray-400 py-16">
            <div className="border-t flex flex-1 h-0 border-gray-700"></div>
            {pageCount <= 3 ? (
              <button
                disabled={loading}
                className="px-8 py-3 bg-linear-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 disabled:from-gray-700 disabled:to-gray-600 disabled:cursor-not-wait text-white font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-blue-500/50 disabled:shadow-none"
                onClick={handleMoreGames}
              >
                {loading ? "Loading..." : "Load More Games"}
              </button>
            ) : (
              <p className="text-center px-4">
                No more games to load. Try searching for something else.
              </p>
            )}
            <div className="border-t flex flex-1 h-0 border-gray-700"></div>
          </div>
        </>
      )}
    </div>
  );
}
