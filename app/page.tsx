import Image from "next/image";
import Link from "next/link";
import { GetGames } from "@/lib/game";
import { FaStar } from "react-icons/fa";
import GameFilters from "./components/GameFilters";
import FeaturedGameCarousel from "./components/FeaturedGameCarousel";
import ViewMoreButton from "./components/ViewMoreButton";
import { auth } from "@/lib/actions/auth";
import prisma from "@/lib/prisma";
import { ROUTES, PATHS } from "@/app/_config/routes";
import {
  IoLockClosed,
  IoGift,
  IoTrophy,
  IoGameController,
  IoLibrary,
  IoHeart,
  IoGrid,
  IoList,
  IoFunnel,
} from "react-icons/io5";

export const metadata = {
  title: "Game Portal",
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Home(props: {
  searchParams?: Promise<{
    query?: string;
    page?: string;
    searchType?: "name" | "publisher";
    genres?: string;
    platforms?: string;
    ordering?: string;
    dates?: string;
    stores?: string;
    view?: "trending" | "top-rated" | "new-releases" | "critics-choice";
    loadMore?: string;
    viewType?: "grid" | "list";
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";
  const searchType = searchParams?.searchType || "name";
  const viewMode = searchParams?.view;
  const loadMore = parseInt(searchParams?.loadMore || "0");
  const viewType = searchParams?.viewType || "grid";

  const filters = {
    genres: searchParams?.genres,
    platforms: searchParams?.platforms,
    ordering: searchParams?.ordering || "-added",
    dates: searchParams?.dates,
    stores: searchParams?.stores,
  };

  let games;
  games = await GetGames(1, 24, query, searchType, filters);

  // Get different categories of games
  const [newReleases, highestRated, bestMetacritic] = await Promise.all([
    GetGames(1, 5, "", "name", { ordering: "-released" }),
    GetGames(1, 5, "", "name", { ordering: "-rating" }),
    GetGames(1, 5, "", "name", { ordering: "-metacritic" }),
  ]);

  // Calculate how many games to load based on loadMore (0=20, 1=40, 2=60)
  const gamesLimit = Math.min((loadMore + 1) * 20, 60);

  // View mode configurations
  const viewConfigs = {
    trending: {
      title: "Trending Now",
      subtitle: "Popular games right now",
      gradient: "from-blue-400 to-purple-400",
      games: await GetGames(1, gamesLimit, "", "name", { ordering: "-added" }),
    },
    "top-rated": {
      title: "Top Rated Games",
      subtitle: "Highest rated by players",
      gradient: "from-amber-400 to-orange-400",
      games: await GetGames(1, gamesLimit, "", "name", { ordering: "-rating" }),
    },
    "new-releases": {
      title: "New Releases",
      subtitle: "Latest games just released",
      gradient: "from-green-400 to-emerald-400",
      games: await GetGames(1, gamesLimit, "", "name", {
        ordering: "-released",
      }),
    },
    "critics-choice": {
      title: "Critics' Choice",
      subtitle: "Highest Metacritic scores",
      gradient: "from-purple-400 to-pink-400",
      games: await GetGames(1, gamesLimit, "", "name", {
        ordering: "-metacritic",
      }),
    },
  };

  // If in view mode, show only that category (skip homepage data)
  if (viewMode && viewConfigs[viewMode]) {
    const config = viewConfigs[viewMode];
    const canLoadMore = loadMore < 2;
    const hasReachedLimit = loadMore >= 2;

    return (
      <main className="flex flex-1 w-full min-h-screen justify-center px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col w-full max-w-7xl gap-6 sm:gap-8 pb-8">
          {/* Header with back button */}
          <div className="flex flex-col gap-4">
            <Link
              href="/"
              className="text-sm text-zinc-400 hover:text-zinc-300 font-bold transition-all py-2 rounded-lg w-fit"
            >
              ← Back to Store
            </Link>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
              <div>
                <h1
                  className={`text-3xl sm:text-5xl font-black bg-linear-to-r ${config.gradient} bg-clip-text text-transparent`}
                >
                  {config.title}
                </h1>
                <p className="text-zinc-500 mt-2 text-sm sm:text-base">
                  {config.subtitle}
                </p>
              </div>
              <div className="flex gap-2">
                {/* Filter Button */}
                <button className="flex items-center gap-2 px-4 py-2 bg-zinc-800/50 hover:bg-zinc-800/70 border border-zinc-700/50 text-zinc-300 rounded-lg font-bold transition-all">
                  <IoFunnel size={16} />
                  Filter
                </button>
                {/* View Type Switcher */}
                <div className="flex gap-1 bg-zinc-800/50 border border-zinc-700/50 rounded-lg p-1">
                  <Link
                    href={`/?view=${viewMode}&loadMore=${loadMore}&viewType=grid`}
                    className={`p-2 rounded transition-all ${
                      viewType === "grid"
                        ? "bg-zinc-700 text-white"
                        : "text-zinc-400 hover:text-zinc-300"
                    }`}
                  >
                    <IoGrid size={18} />
                  </Link>
                  <Link
                    href={`/?view=${viewMode}&loadMore=${loadMore}&viewType=list`}
                    className={`p-2 rounded transition-all ${
                      viewType === "list"
                        ? "bg-zinc-700 text-white"
                        : "text-zinc-400 hover:text-zinc-300"
                    }`}
                  >
                    <IoList size={18} />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Grid View */}
          {viewType === "grid" && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {config.games.map(
                (game: {
                  id: number;
                  name: string;
                  background_image: string | null;
                  rating: number;
                }) => (
                  <Link
                    key={game.id}
                    href={`${PATHS.DETAILS}/${game.id}`}
                    className="aspect-3/4 bg-zinc-900/60 backdrop-blur-sm rounded-xl border border-zinc-800/80 hover:border-zinc-700/80 overflow-hidden group transition-all relative duration-300"
                  >
                    {game.background_image ? (
                      <Image
                        src={game.background_image}
                        fill
                        alt={game.name}
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="flex items-center justify-center w-full h-full text-gray-500">
                        <IoGameController size={40} />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-linear-to-t from-black via-black/40 to-transparent opacity-70 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                        <p className="text-white text-sm font-bold line-clamp-2 mb-2">
                          {game.name}
                        </p>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1 bg-zinc-900/70 backdrop-blur-sm px-2 py-1 rounded-lg border border-zinc-700/50">
                            <FaStar className="text-amber-500" size={10} />
                            <span className="text-xs text-zinc-200 font-bold">
                              {game.rating}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ),
              )}
            </div>
          )}

          {/* List View */}
          {viewType === "list" && (
            <div className="flex flex-col gap-3">
              {config.games.map(
                (game: {
                  id: number;
                  name: string;
                  background_image: string | null;
                  rating: number;
                }) => (
                  <Link
                    key={game.id}
                    href={`${PATHS.DETAILS}/${game.id}`}
                    className="flex gap-4 bg-zinc-900/60 backdrop-blur-sm rounded-xl border border-zinc-800/80 hover:border-zinc-700/80 overflow-hidden group transition-all duration-300 p-4"
                  >
                    <div className="relative w-32 h-20 flex-shrink-0 rounded-lg overflow-hidden">
                      {game.background_image ? (
                        <Image
                          src={game.background_image}
                          fill
                          alt={game.name}
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="flex items-center justify-center w-full h-full bg-zinc-800 text-gray-500">
                          <IoGameController size={32} />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 flex items-center justify-between">
                      <div>
                        <h3 className="text-white font-bold text-lg mb-1 group-hover:text-blue-400 transition-colors">
                          {game.name}
                        </h3>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1 bg-zinc-900/70 backdrop-blur-sm px-2 py-1 rounded-lg border border-zinc-700/50">
                            <FaStar className="text-amber-500" size={12} />
                            <span className="text-sm text-zinc-200 font-bold">
                              {game.rating}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-zinc-400 text-sm">→</div>
                    </div>
                  </Link>
                ),
              )}
            </div>
          )}

          {/* View More Button or Search Prompt */}
          <div className="flex justify-center mt-8">
            {canLoadMore ? (
              <ViewMoreButton
                viewMode={viewMode}
                loadMore={loadMore}
                viewType={viewType}
              />
            ) : hasReachedLimit ? (
              <div className="flex flex-row w-full items-center justify-between bg-zinc-900/60 backdrop-blur-sm border border-zinc-800/80 rounded-xl p-6 ">
                <div className="flex flex-row gap-5">
                  <IoGameController className="text-zinc-400" size={48} />
                  <div className="flex flex-col">
                    <p className="text-zinc-400 font-bold mb-1">
                      You've reached the display limit
                    </p>
                    <p className="text-zinc-500 text-sm">
                      Use the search feature to find more specific games
                    </p>
                  </div>
                </div>
                <Link
                  href="/"
                  className="inline-block bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-200 px-6 py-2 rounded-lg font-bold transition-all duration-300"
                >
                  Back to Store
                </Link>
              </div>
            ) : null}
          </div>
        </div>
      </main>
    );
  }

  // Homepage data (only load when not in view mode)
  const session = await auth();
  let userLibraryCount = 0;

  if (session?.user?.id) {
    userLibraryCount = await prisma.libraryItem.count({
      where: {
        userId: session.user.id,
      },
    });
  }

  // Get featured games (top 5 for carousel)
  const featuredGames = games.slice(0, 5);

  // Get top rated games (by rating)
  const topGames = [...games].sort((a, b) => b.rating - a.rating).slice(0, 3);

  // Get recent games
  const recentGames = games.slice(1, 6);

  return (
    <main className="flex flex-1 w-full min-h-screen justify-center px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col w-full max-w-7xl gap-6 sm:gap-8 pb-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
          <div className="relative">
            <div className="relative">
              <h1 className="text-3xl sm:text-5xl font-black bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Store Highlights
              </h1>
              <p className="text-zinc-500 mt-2 text-sm sm:text-base">
                Discover amazing games curated just for you
              </p>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            <GameFilters />
          </div>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[200px]">
          {/* Featured Game Carousel - Large Card (2x2) */}
          <FeaturedGameCarousel games={featuredGames} />

          {/* Daily Reward Card */}
          <div className="bg-linear-to-br from-purple-900/30 to-purple-800/20 border border-purple-800/40 rounded-2xl p-5 flex flex-col justify-center items-center hover:border-purple-700/50 transition-all duration-300 group relative overflow-hidden">
            {/* Coming Soon Overlay */}
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md rounded-2xl flex items-center justify-center z-10">
              <div className="text-center">
                <IoLockClosed
                  className="text-purple-400 mx-auto mb-3 animate-pulse"
                  size={60}
                />
                <span className="text-xl font-black bg-linear-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent block mb-2">
                  COMING SOON
                </span>
                <span className="text-zinc-400 text-xs">
                  Daily rewards launching soon
                </span>
              </div>
            </div>
            <IoGift className="text-purple-400 mb-3" size={40} />
            <span className="text-purple-300 font-bold mb-3 text-center text-sm">
              Daily Reward
            </span>
            <button className="w-full bg-purple-900/50 hover:bg-purple-800/60 border border-purple-700/50 text-purple-200 px-4 py-2 rounded-lg text-xs font-bold transition-all">
              Claim +50 Orbs
            </button>
          </div>

          {/* Top Players Card */}
          <div className="bg-zinc-900/80 backdrop-blur-md border border-zinc-800/80 rounded-2xl p-4 hover:border-zinc-700/80 transition-all duration-300 group">
            <h3 className="font-bold text-zinc-400 text-xs mb-3 flex items-center gap-2">
              <IoTrophy size={16} /> TOP RATED
            </h3>
            <div className="space-y-2">
              {topGames.slice(0, 3).map((game, index) => {
                const badgeColor =
                  index === 0
                    ? "bg-linear-to-br from-yellow-400 to-yellow-600"
                    : index === 1
                      ? "bg-linear-to-br from-gray-300 to-gray-500"
                      : "bg-linear-to-br from-orange-400 to-orange-700";

                return (
                  <Link
                    key={game.id}
                    href={`${PATHS.DETAILS}/${game.id}`}
                    className="flex items-center gap-2 hover:bg-zinc-800/70 p-1.5 rounded-lg transition-all duration-200"
                  >
                    <div
                      className={`w-6 h-6 ${badgeColor} rounded-full text-white text-xs flex items-center justify-center font-bold shadow-lg`}
                    >
                      {index + 1}
                    </div>
                    <span className="text-xs flex-1 truncate font-medium text-zinc-300">
                      {game.name}
                    </span>
                    <span className="text-xs text-amber-500 flex items-center gap-1">
                      <FaStar size={9} className="fill-amber-500" />
                      {game.rating}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Special Offer Card */}
          <div className="md:col-span-2 bg-linear-to-r from-blue-900/30 to-indigo-900/30 border border-blue-800/40 rounded-2xl p-6 flex items-center justify-between hover:border-blue-700/50 transition-all duration-300 group relative overflow-hidden">
            {/* Coming Soon Overlay */}
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md rounded-2xl flex items-center justify-center z-20">
              <div className="text-center">
                <IoLockClosed
                  className="text-blue-400 mx-auto mb-3 animate-pulse"
                  size={60}
                />
                <span className="text-2xl font-black bg-linear-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent block mb-2">
                  COMING SOON
                </span>
                <span className="text-zinc-400 text-sm">
                  Exclusive deals arriving soon
                </span>
              </div>
            </div>
            <div className="relative z-10">
              <div className="font-bold text-xl sm:text-2xl text-white flex items-center gap-2">
                <IoGameController size={24} /> Special Offer
              </div>
              <div className="text-blue-300 text-sm mt-2">
                Limited time deals
              </div>
            </div>
            <Link
              href={PATHS.STORE}
              className="bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-200 px-6 py-2 rounded-lg font-bold transition-all duration-300 relative z-10"
            >
              View →
            </Link>
          </div>

          {/* Stats Card */}
          <div className="bg-linear-to-br from-emerald-900/30 to-emerald-800/20 border border-emerald-800/40 rounded-2xl p-5 flex flex-col justify-center hover:border-emerald-700/50 transition-all duration-300 group relative overflow-hidden">
            <div className="text-xs text-emerald-400 font-bold mb-2 flex items-center gap-1">
              <IoLibrary size={16} /> YOUR LIBRARY
            </div>
            <div className="flex items-baseline gap-2 mb-3">
              <span className="text-4xl font-black text-emerald-400">
                {userLibraryCount}
              </span>
              <span className="text-sm text-emerald-500 font-medium">
                {userLibraryCount === 1 ? "Game" : "Games"}
              </span>
            </div>
            <Link
              href={PATHS.LIBRARY}
              className="w-full text-center bg-emerald-900/50 hover:bg-emerald-800/60 border border-emerald-700/50 text-emerald-300 text-xs py-2 rounded-lg transition-all font-bold"
            >
              View Library
            </Link>
          </div>

          {/* Wishlist Card */}
          <div className="bg-linear-to-br from-rose-900/30 to-rose-800/20 border border-rose-800/40 rounded-2xl p-5 flex flex-col justify-center hover:border-rose-700/50 transition-all duration-300 group relative overflow-hidden">
            <div className="text-center relative z-10">
              <IoHeart className="text-rose-500 mx-auto mb-3" size={40} />
              <div className="text-xs text-rose-400 font-bold mb-3">
                WISHLIST
              </div>
              <Link
                href={PATHS.WISHLIST}
                className="w-full inline-block bg-rose-900/50 hover:bg-rose-800/60 border border-rose-700/50 text-rose-300 text-xs py-2 rounded-lg transition-all font-bold"
              >
                View All
              </Link>
            </div>
          </div>
        </div>

        {/* Recent Games Grid */}
        <div className="mt-4">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-2xl sm:text-3xl font-black bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Trending Now
              </h3>
              <p className="text-zinc-500 text-sm mt-1">
                Popular games right now
              </p>
            </div>
            <Link
              href="/?view=trending"
              className="text-sm text-zinc-400 hover:text-zinc-300 font-bold transition-all px-4 py-2 rounded-lg"
            >
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {recentGames.map(
              (game: {
                id: number;
                name: string;
                background_image: string | null;
                rating: number;
              }) => (
                <Link
                  key={game.id}
                  href={`${PATHS.DETAILS}/${game.id}`}
                  className="aspect-3/4 bg-zinc-900/60 backdrop-blur-sm rounded-xl border border-zinc-800/80 hover:border-zinc-700/80 overflow-hidden group transition-all relative duration-300"
                >
                  {game.background_image ? (
                    <Image
                      src={game.background_image}
                      fill
                      alt={game.name}
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full text-gray-500">
                      <IoGameController size={40} />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-linear-to-t from-black via-black/40 to-transparent opacity-70 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                      <p className="text-white text-sm font-bold line-clamp-2 mb-2">
                        {game.name}
                      </p>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 bg-zinc-900/70 backdrop-blur-sm px-2 py-1 rounded-lg border border-zinc-700/50">
                          <FaStar className="text-amber-500" size={10} />
                          <span className="text-xs text-zinc-200 font-bold">
                            {game.rating}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ),
            )}
          </div>
        </div>

        {/* Top Rated Games Grid */}
        <div className="mt-4">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-2xl sm:text-3xl font-black bg-linear-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
                Top Rated Games
              </h3>
              <p className="text-zinc-500 text-sm mt-1">
                Highest rated by players
              </p>
            </div>
            <Link
              href="/?view=top-rated"
              className="text-sm text-zinc-400 hover:text-zinc-300 font-bold transition-all px-4 py-2 rounded-lg"
            >
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {highestRated.map(
              (game: {
                id: number;
                name: string;
                background_image: string | null;
                rating: number;
              }) => (
                <Link
                  key={game.id}
                  href={`${PATHS.DETAILS}/${game.id}`}
                  className="aspect-3/4 bg-zinc-900/60 backdrop-blur-sm rounded-xl border border-zinc-800/80 hover:border-zinc-700/80 overflow-hidden group transition-all relative duration-300"
                >
                  {game.background_image ? (
                    <Image
                      src={game.background_image}
                      fill
                      alt={game.name}
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full text-gray-500">
                      <IoGameController size={40} />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-linear-to-t from-black via-black/40 to-transparent opacity-70 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                      <p className="text-white text-sm font-bold line-clamp-2 mb-2">
                        {game.name}
                      </p>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 bg-amber-900/70 backdrop-blur-sm px-2 py-1 rounded-lg border border-amber-700/50">
                          <FaStar className="text-amber-500" size={10} />
                          <span className="text-xs text-zinc-200 font-bold">
                            {game.rating}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ),
            )}
          </div>
        </div>

        {/* New Releases Grid */}
        <div className="mt-4">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-2xl sm:text-3xl font-black bg-linear-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                New Releases
              </h3>
              <p className="text-zinc-500 text-sm mt-1">
                Latest games just released
              </p>
            </div>
            <Link
              href="/?view=new-releases"
              className="text-sm text-zinc-400 hover:text-zinc-300 font-bold transition-all px-4 py-2 rounded-lg"
            >
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {newReleases.map(
              (game: {
                id: number;
                name: string;
                background_image: string | null;
                rating: number;
              }) => (
                <Link
                  key={game.id}
                  href={`${PATHS.DETAILS}/${game.id}`}
                  className="aspect-3/4 bg-zinc-900/60 backdrop-blur-sm rounded-xl border border-zinc-800/80 hover:border-zinc-700/80 overflow-hidden group transition-all relative duration-300"
                >
                  {game.background_image ? (
                    <Image
                      src={game.background_image}
                      fill
                      alt={game.name}
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full text-gray-500">
                      <IoGameController size={40} />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-linear-to-t from-black via-black/40 to-transparent opacity-70 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                      <p className="text-white text-sm font-bold line-clamp-2 mb-2">
                        {game.name}
                      </p>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 bg-zinc-900/70 backdrop-blur-sm px-2 py-1 rounded-lg border border-zinc-700/50">
                          <FaStar className="text-amber-500" size={10} />
                          <span className="text-xs text-zinc-200 font-bold">
                            {game.rating}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ),
            )}
          </div>
        </div>

        {/* Best Metacritic Grid */}
        <div className="mt-4">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-2xl sm:text-3xl font-black bg-linear-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Critics' Choice
              </h3>
              <p className="text-zinc-500 text-sm mt-1">
                Highest Metacritic scores
              </p>
            </div>
            <Link
              href="/?view=critics-choice"
              className="text-sm text-zinc-400 hover:text-zinc-300 font-bold transition-all px-4 py-2 rounded-lg"
            >
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {bestMetacritic.map(
              (game: {
                id: number;
                name: string;
                background_image: string | null;
                rating: number;
              }) => (
                <Link
                  key={game.id}
                  href={`${PATHS.DETAILS}/${game.id}`}
                  className="aspect-3/4 bg-zinc-900/60 backdrop-blur-sm rounded-xl border border-zinc-800/80 hover:border-zinc-700/80 overflow-hidden group transition-all relative duration-300"
                >
                  {game.background_image ? (
                    <Image
                      src={game.background_image}
                      fill
                      alt={game.name}
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-full text-gray-500">
                      <IoGameController size={40} />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-linear-to-t from-black via-black/40 to-transparent opacity-70 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                      <p className="text-white text-sm font-bold line-clamp-2 mb-2">
                        {game.name}
                      </p>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 bg-zinc-900/70 backdrop-blur-sm px-2 py-1 rounded-lg border border-zinc-700/50">
                          <FaStar className="text-amber-500" size={10} />
                          <span className="text-xs text-zinc-200 font-bold">
                            {game.rating}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ),
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
