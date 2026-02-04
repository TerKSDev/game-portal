import Header from "@/app/components/Header";
import GameList from "./components/GameList";
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
  }>;
}) {
  const searchParams = await props.searchParams;
  const query = searchParams?.query || "";
  let games;

  games = await GetGames(1, 24, query);

  return (
    <main className="flex flex-1 w-screen h-full min-h-screen justify-center pt-32 px-4 sm:px-6 lg:px-8">
      <GameList game={games} query={query} />
    </main>
  );
}
