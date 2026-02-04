import Header from "@/app/components/Header";
import GameList from "./components/GameList";
import GameFilters from "./components/GameFilters";
import { GetGames } from "@/lib/game";

export const metadata = {
  title: "Store",
  description:
    "Browse thousands of games and discover your next adventure. Find the best deals on the latest releases and timeless classics.",
};

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
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";
  const searchType = searchParams?.searchType || "name";

  const filters = {
    genres: searchParams?.genres,
    platforms: searchParams?.platforms,
    ordering: searchParams?.ordering || "-added",
    dates: searchParams?.dates,
    stores: searchParams?.stores,
  };

  let games;
  games = await GetGames(1, 24, query, searchType, filters);

  return (
    <main className="flex flex-1 w-screen h-full min-h-screen justify-center pt-24 sm:pt-32 px-2 sm:px-4 lg:px-8">
      <div className="flex flex-col w-full max-w-7xl gap-4 sm:gap-6">
        <div className="flex justify-end">
          <GameFilters />
        </div>
        <GameList
          game={games}
          query={query}
          searchType={searchType}
          filters={filters}
        />
      </div>
    </main>
  );
}
