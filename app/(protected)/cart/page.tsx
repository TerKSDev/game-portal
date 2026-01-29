import { redirect } from "next/navigation";
import CartItem from "./_components/CartItem";
import SummaryCard from "./_components/SummaryCard";
import { auth } from "@/lib/actions/auth";
import { PATHS } from "@/app/_config/routes";
import { GetGamePrice } from "@/lib/game";

import { FaShoppingCart } from "react-icons/fa";
import prisma from "@/lib/prisma";

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
      const price = priceData?.final
        ? parseFloat(priceData.final.replace(/[^\d.]/g, ""))
        : 0;

      return {
        ...item,
        price,
        addedAt: item.addedAt.toLocaleDateString(),
      };
    }),
  );

  const totalAmount = cartItems.reduce((acc, item) => {
    return acc + item.price;
  }, 0);

  return (
    <div className="flex flex-col flex-1 pt-32 px-4 sm:px-6 lg:px-8 pb-12 min-h-screen">
      <div className="max-w-7xl mx-auto w-full">
        <h1 className="text-3xl font-bold mb-8 bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Shopping Cart
        </h1>
        {cartItems.length !== 0 ? (
          <div className="flex flex-1 flex-row gap-6 max-lg:flex-col">
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
