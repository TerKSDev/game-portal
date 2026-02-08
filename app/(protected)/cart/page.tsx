import { redirect } from "next/navigation";
import CartItem from "./_components/CartItem";
import SummaryCard from "./_components/SummaryCard";
import { auth } from "@/lib/actions/auth";
import { PATHS } from "@/app/_config/routes";
import { GetGamePrice } from "@/lib/game";
import Link from "next/link";

import { FaShoppingCart } from "react-icons/fa";
import prisma from "@/lib/prisma";

export const metadata = {
  title: "Shopping Cart",
  description: "Review your selected games and complete your purchase.",
};

export default async function Cart() {
  const session = await auth();

  if (!session || !session.user || !session.user.id) {
    redirect(PATHS.LOGIN);
  }

  const rawCartItems = await prisma.cartItem.findMany({
    where: { userId: session.user.id },
  });

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { orbs: true },
  });

  const userOrbs = user?.orbs || 0;

  const cartItems = await Promise.all(
    rawCartItems.map(async (item) => {
      const priceData = await GetGamePrice(item.name);
      let price = 0;

      if (priceData?.final) {
        const priceStr = priceData.final.toLowerCase();
        if (priceStr === "free" || priceStr === "0") {
          price = 0;
        } else {
          const parsedPrice = parseFloat(
            priceData.final.replace(/[^\d.]/g, ""),
          );
          price = isNaN(parsedPrice) ? 0 : parsedPrice;
        }
      }

      return {
        ...item,
        price,
        addedAt: item.addedAt.toISOString(),
      };
    }),
  );

  const totalAmount = cartItems.reduce((acc, item) => {
    return acc + item.price;
  }, 0);

  return (
    <main className="flex flex-1 w-full min-h-screen justify-center px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col w-full max-w-7xl gap-6">
        {/* Header Section */}
        <div className="relative">
          <h1 className="text-3xl sm:text-5xl font-black bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Shopping Cart
          </h1>
          <p className="text-zinc-500 mt-2 text-sm sm:text-base">
            {cartItems.length} {cartItems.length === 1 ? "item" : "items"} in
            your cart
          </p>
        </div>

        {/* Cart Items */}
        {cartItems.length !== 0 ? (
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex flex-col flex-2 gap-4">
              {cartItems.map((item) => {
                return <CartItem key={item.id} item={item} />;
              })}
            </div>

            <SummaryCard totalAmount={totalAmount} userOrbs={userOrbs} />
          </div>
        ) : (
          <div className="flex items-center justify-center min-h-100 backdrop-blur-md border border-zinc-800/80 rounded-2xl p-12 mt-12">
            <div className="flex flex-col text-center justify-center items-center gap-6">
              <FaShoppingCart className="text-gray-300" size={80} />
              <div className="space-y-2">
                <p className="text-zinc-400 text-xl font-medium">
                  Your cart is empty
                </p>
                <p className="text-zinc-500 text-sm">
                  Add some games to get started!
                </p>
              </div>
              <Link
                href={PATHS.STORE}
                className="inline-block bg-linear-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 px-8 py-3 rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-blue-500/50"
              >
                Browse Store
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
