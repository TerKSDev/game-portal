import Header from "@/app/components/Header";
import GameList from "./components/GameList";
import { GetGames } from "@/lib/game";

import { ROUTES } from "@/app/_config/routes";

function GetTitle(path: string) {
  const route = ROUTES.find((r) => r.path === path);
  return route ? route.name : "Game Portal";
}

export const metadata = {
  title: GetTitle("/"),
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
    <main className="flex flex-1 w-screen h-full min-h-screen  justify-center">
      <GameList game={games} query={query} />
    </main>
  );
}
