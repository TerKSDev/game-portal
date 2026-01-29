import prisma from "@/lib/prisma";
import { auth } from "@/lib/actions/auth";
import { redirect } from "next/navigation";
import { PATHS } from "@/app/_config/routes";
import LibraryItem from "./_components/LibraryItem";
import ItemDetails from "./_components/ItemDetails";
import Link from "next/link";
import PaymentSuccess from "../cart/payment-success/PaymentSuccess";

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
    <>
      {showSuccess && <PaymentSuccess />}
      <div className="flex flex-row flex-1 pt-24 min-h-screen">
        <div className="flex w-80 max-lg:w-64 flex-col bg-gray-900/80 backdrop-blur-md border-r border-gray-700/50 py-4 overflow-y-auto shadow-2xl">
          <h2 className="text-xl font-bold mb-4 px-6 text-blue-400">
            My Library
          </h2>
          <div className="flex flex-col">
            {libraryItems.map((item) => {
              const isSelected = selectedItem?.id === item.id;
              return (
                <Link
                  key={item.id}
                  href={PATHS.LIBRARY + `?id=${item.id}`}
                  className={`block transition-all duration-200 ${
                    isSelected
                      ? "bg-blue-600/20 border-l-4 border-blue-500"
                      : "hover:bg-gray-700/50 border-l-4 border-transparent"
                  }`}
                >
                  <LibraryItem
                    key={item.id}
                    itemDetails={item}
                    isSelected={isSelected}
                  />
                </Link>
              );
            })}
          </div>
        </div>

        <div className="animate-fade-in flex flex-1 bg-linear-to-br from-gray-900/50 to-gray-800/50">
          {selectedItem ? (
            <ItemDetails key={selectedItem.id} itemDetails={selectedItem} />
          ) : (
            <div className="flex items-center justify-center w-full">
              <p className="text-gray-400 text-lg">
                Select a game to view details
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
