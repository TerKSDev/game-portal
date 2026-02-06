import { redirect } from "next/navigation";
import CartItem from "./_components/CartItem";
import SummaryCard from "./_components/SummaryCard";
import { auth } from "@/lib/actions/auth";
import { PATHS } from "@/app/_config/routes";
import { GetGamePrice } from "@/lib/game";

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
    <div className="flex flex-col flex-1 pt-20 sm:pt-24 lg:pt-32 px-3 sm:px-4 lg:px-8 pb-8 sm:pb-12 min-h-screen">
      <div className="max-w-7xl mx-auto w-full">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-8 bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent max-sm:mt-6">
          Shopping Cart
        </h1>
        {cartItems.length !== 0 ? (
          <div className="flex flex-1 flex-col lg:flex-row gap-4 sm:gap-6">
            <div className="flex flex-col flex-2 gap-4">
              {cartItems.map((item) => {
                return <CartItem key={item.id} item={item} />;
              })}
            </div>

            <SummaryCard totalAmount={totalAmount} userOrbs={userOrbs} />
          </div>
        ) : (
          <div className="flex flex-col flex-1 items-center justify-center min-h-100 gap-8">
            <FaShoppingCart size={42} />
            <div className="text-center gap-1.5">
              <p className="text-gray-400 text-xl">Your cart is empty</p>
              <p className="text-gray-500 text-sm">
                Add some games to get started!
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
