import { auth } from "@/lib/actions/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { PATHS } from "@/app/_config/routes";
import TransactionHistory from "./TransactionHistory";

export const metadata = {
  title: "Purchase History",
  description: "View all your transaction history and purchases.",
};

export default async function PurchaseHistoryPage() {
  const session = await auth();

  if (!session || !session.user || !session.user.id) {
    redirect(PATHS.LOGIN);
  }

  // Get transactions with related library items for purchases
  const transactions = await prisma.transaction.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Get library items to match with purchase transactions
  const libraryItems = await prisma.libraryItem.findMany({
    where: {
      userId: session.user.id,
    },
    select: {
      gameId: true,
      name: true,
      image: true,
      purchasedPrice: true,
      purchasedAt: true,
    },
  });

  const formattedTransactions = transactions.map((transaction) => {
    // For purchase transactions, find matching library items
    let purchasedGames: Array<{
      gameId: number;
      name: string;
      image: string;
      price: string;
    }> = [];

    if (transaction.type === "Purchase") {
      // Match library items by purchase time (within 1 minute of transaction)
      const transactionTime = transaction.createdAt.getTime();
      purchasedGames = libraryItems
        .filter((item) => {
          const itemTime = item.purchasedAt.getTime();
          return Math.abs(itemTime - transactionTime) < 60000; // 1 minute tolerance
        })
        .map((item) => ({
          gameId: item.gameId,
          name: item.name,
          image: item.image,
          price: item.purchasedPrice,
        }));
    }

    return {
      ...transaction,
      createdAt: transaction.createdAt.toISOString(),
      purchasedGames,
    };
  });

  return (
    <div className="flex flex-1 pt-32 px-4 sm:px-6 lg:px-8 pb-12 min-h-screen">
      <div className="max-w-6xl mx-auto w-full">
        <h1 className="text-3xl font-bold mb-8 bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Purchase History
        </h1>
        <TransactionHistory transactions={formattedTransactions} />
      </div>
    </div>
  );
}
