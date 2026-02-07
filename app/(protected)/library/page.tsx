import prisma from "@/lib/prisma";
import { auth } from "@/lib/actions/auth";
import { redirect } from "next/navigation";
import { PATHS } from "@/app/_config/routes";
import LibraryItem from "./_components/LibraryItem";
import ItemDetails from "./_components/ItemDetails";
import LibrarySearchBar from "./_components/LibrarySearchBar";
import Link from "next/link";
import PaymentSuccess from "../cart/payment-success/PaymentSuccess";

export const metadata = {
  title: "Library",
  description: "Access all your purchased games in one place.",
};

export interface LibraryProps {
  id: string;
  userId: string;
  gameId: number;
  gameUrl: string;
  name: string;
  image: string;
  purchasedPrice: string;
  purchasedAt: string;
}

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function Library(props: PageProps) {
  const searchParams = await props.searchParams;
  const selectedId = searchParams.id as string;
  const showSuccess = searchParams.success === "true";
  const searchQuery = (searchParams.query as string) || "";
  const sortBy = (searchParams.sort as string) || "purchasedAt-desc";
  const dateFilter = (searchParams.dateFilter as string) || "";
  const priceFilter = (searchParams.priceFilter as string) || "";
  const session = await auth();

  if (!session || !session.user || !session.user.id) {
    redirect(PATHS.LOGIN);
  }

  const userId = session.user.id;

  const rawLibrary = await prisma.libraryItem.findMany({
    where: {
      userId,
    },
    orderBy: {
      name: "asc",
    },
  });

  const libraryItems = rawLibrary.map((item) => ({
    ...item,
    purchasedAt: item.purchasedAt.toISOString(),
    purchasedAtRaw: item.purchasedAt,
    purchasedPrice: item.purchasedPrice.toString(),
    purchasedPriceRaw: parseFloat(item.purchasedPrice.toString()),
  }));

  // 根据搜索查询过滤游戏
  let filteredItems = searchQuery
    ? libraryItems.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : libraryItems;

  // 根据日期过滤
  if (dateFilter) {
    const now = new Date();
    filteredItems = filteredItems.filter((item) => {
      const itemDate = new Date(item.purchasedAtRaw);
      const daysDiff = Math.floor(
        (now.getTime() - itemDate.getTime()) / (1000 * 60 * 60 * 24),
      );
      switch (dateFilter) {
        case "week":
          return daysDiff <= 7;
        case "month":
          return daysDiff <= 30;
        case "3months":
          return daysDiff <= 90;
        case "year":
          return daysDiff <= 365;
        default:
          return true;
      }
    });
  }

  // 根据价格过滤
  if (priceFilter) {
    filteredItems = filteredItems.filter((item) => {
      const price = item.purchasedPriceRaw;
      switch (priceFilter) {
        case "under10":
          return price < 10;
        case "10to30":
          return price >= 10 && price < 30;
        case "30to60":
          return price >= 30 && price < 60;
        case "over60":
          return price >= 60;
        default:
          return true;
      }
    });
  }

  // 根据排序选项排序游戏
  const sortedItems = [...filteredItems].sort((a, b) => {
    switch (sortBy) {
      case "name-asc":
        return a.name.localeCompare(b.name);
      case "name-desc":
        return b.name.localeCompare(a.name);
      case "purchasedAt-desc":
        return b.purchasedAtRaw.getTime() - a.purchasedAtRaw.getTime();
      case "purchasedAt-asc":
        return a.purchasedAtRaw.getTime() - b.purchasedAtRaw.getTime();
      case "price-desc":
        return b.purchasedPriceRaw - a.purchasedPriceRaw;
      case "price-asc":
        return a.purchasedPriceRaw - b.purchasedPriceRaw;
      default:
        return 0;
    }
  });

  const selectedItem = selectedId
    ? sortedItems.find((item) => item.id === selectedId)
    : sortedItems[0];

  return (
    <>
      {showSuccess && <PaymentSuccess />}
      <main className="flex flex-1 w-full min-h-screen justify-center px-4 sm:px-5 lg:px-6 py-6">
        <div className="flex flex-col lg:flex-row w-full max-w-7xl gap-6">
          {/* Header Section */}
          <div className="lg:hidden mb-4">
            <h1 className="text-3xl sm:text-4xl font-black bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              My Library
            </h1>
            <p className="text-zinc-500 mt-2 text-sm">
              {sortedItems.length} {sortedItems.length === 1 ? "game" : "games"}{" "}
              in your collection
            </p>
          </div>

          {/* Left Sidebar - Game List */}
          <div className="flex flex-1 w-full lg:w-96 flex-col bg-zinc-900/50 backdrop-blur-md border border-zinc-800/80 rounded-2xl overflow-hidden shadow-2xl">
            {/* Desktop Header */}
            <div className="hidden lg:block p-6 border-b border-zinc-800 shrink-0">
              <h1 className="text-2xl font-black bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                My Library
              </h1>
              <p className="text-zinc-500 mt-1 text-sm">
                {sortedItems.length}{" "}
                {sortedItems.length === 1 ? "game" : "games"}
              </p>
            </div>

            <div className="p-4 border-b border-zinc-800 shrink-0">
              <LibrarySearchBar />
            </div>
            <div className="flex flex-col overflow-y-auto flex-1 max-h-100 lg:max-h-none">
              {sortedItems.length > 0 ? (
                sortedItems.map((item) => {
                  const isSelected = selectedItem?.id === item.id;
                  const linkParams = new URLSearchParams();
                  linkParams.set("id", item.id);
                  if (searchQuery) {
                    linkParams.set("query", searchQuery);
                  }
                  if (sortBy && sortBy !== "purchasedAt-desc") {
                    linkParams.set("sort", sortBy);
                  }
                  if (dateFilter) {
                    linkParams.set("dateFilter", dateFilter);
                  }
                  if (priceFilter) {
                    linkParams.set("priceFilter", priceFilter);
                  }
                  return (
                    <Link
                      key={item.id}
                      href={PATHS.LIBRARY + `?${linkParams.toString()}`}
                      className={`block transition-all duration-200 mx-2 mb-2 rounded-xl ${
                        isSelected
                          ? "bg-blue-600/20 border-l-4 border-blue-500"
                          : "hover:bg-zinc-800/50 border-l-4 border-transparent"
                      }`}
                    >
                      <LibraryItem
                        key={item.id}
                        itemDetails={item}
                        isSelected={isSelected}
                      />
                    </Link>
                  );
                })
              ) : (
                <div className="px-6 py-12 text-center">
                  <div className="text-5xl mb-4">🎮</div>
                  <p className="text-zinc-400 text-lg">No games found</p>
                  <p className="text-zinc-600 text-sm mt-2">
                    Try adjusting your search or filters
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Panel - Game Details */}
          <div className="flex flex-2 animate-fade-in">
            {selectedItem ? (
              <ItemDetails key={selectedItem.id} itemDetails={selectedItem} />
            ) : (
              <div className="flex items-center justify-center h-full min-h-100 lg:min-h-0 bg-zinc-900/50 backdrop-blur-md border border-zinc-800/80 rounded-2xl">
                <div className="text-center">
                  <div className="text-6xl mb-4">🎮</div>
                  <p className="text-zinc-400 text-lg font-medium">
                    Select a game to view details
                  </p>
                  <p className="text-zinc-600 text-sm mt-2">
                    Choose from your library on the left
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
