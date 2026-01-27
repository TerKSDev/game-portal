import prisma from "@/lib/prisma";
import { auth } from "@/lib/actions/auth";
import { redirect } from "next/navigation";
import { PATHS } from "@/app/_config/routes";
import LibraryItem from "./_components/LibraryItem";
import ItemDetails from "./_components/ItemDetails";
import Link from "next/link";

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
    purchasedAt: item.purchasedAt.toLocaleDateString(),
    purchasedPrice: item.purchasedPrice.toString(),
  }));

  const selectedItem = selectedId
    ? libraryItems.find((item) => item.id === selectedId)
    : libraryItems[0];

  return (
    <div className="flex flex-row flex-1 mt-25 font-mono min-h-[calc(100vh-6.25rem)]">
      <div className="flex flex-1 flex-col bg-gray-800 shadow-gray-900 py-2 shadow-[2px_0_10px] overflow-y-auto">
        {libraryItems.map((item) => {
          const isSelected = selectedItem?.id === item.id;
          return (
            <Link
              key={item.id}
              href={PATHS.LIBRARY + `?id=${item.id}`}
              className={`block transition-colors ${isSelected ? "bg-gray-700" : "hover:bg-gray-700/50"}`}
            >
              <LibraryItem key={item.id} itemDetails={item} />
            </Link>
          );
        })}{" "}
      </div>

      <div className="flex flex-4">
        {selectedItem ? (
          <ItemDetails key={selectedItem.id} itemDetails={selectedItem} />
        ) : (
          <div>Select a game to view details.</div>
        )}
      </div>
    </div>
  );
}
