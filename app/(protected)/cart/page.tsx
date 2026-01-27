import { redirect } from "next/navigation";
import CartItem from "./_components/CartItem";
import SummaryCard from "./_components/SummaryCard";
import { auth } from "@/lib/actions/auth";
import { PATHS } from "@/app/_config/routes";

import prisma from "@/lib/prisma";

export default async function Cart() {
  const session = await auth();

  if (!session || !session.user || !session.user.id) {
    redirect(PATHS.LOGIN);
  }

  const cartItems = await prisma.cartItem.findMany({
    where: { userId: session.user.id },
  });

  const totalAmount = cartItems.reduce((acc, item) => {
    return acc + Number(item.price);
  }, 0);

  return (
    <div className="flex flex-col flex-1 mt-25 p-12 font-mono lg:px-24 max-lg:max-w-2xl mx-auto">
      {cartItems.length !== 0 ? (
        <div className="flex flex-1 flex-row gap-8 lg:px-24 max-lg:flex-col max-lg:max-w-2xl">
          <div className="flex flex-col flex-2 gap-4 bg-gray-900 p-4 rounded max-h-fit">
            {cartItems.map((item) => {
              const newItem = {
                ...item,
                price: Number(item.price),
                addedAt: item.addedAt.toLocaleDateString(),
              };

              return <CartItem key={item.id} item={newItem} />;
            })}
          </div>

          <SummaryCard totalAmount={totalAmount} />
        </div>
      ) : (
        <div className="flex flex-1 items-center justify-center text-gray-400 my-66 text-lg">
          Your cart is empty.
        </div>
      )}
    </div>
  );
}
