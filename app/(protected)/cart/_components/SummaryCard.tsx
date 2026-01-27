"use client";

import { CheckoutButton } from "./Button";

export default function SummaryCard({ totalAmount }: { totalAmount: number }) {
  return (
    <div className="flex flex-col flex-1 bg-gray-900 p-4 rounded gap-8 max-h-fit">
      <div className="flex flex-col gap-2">
        <p className="font-bold text-lg">Order Total</p>
        <div className="flex flex-1 flex-row justify-between text-gray-300 p-2 px-4 bg-gray-700 rounded max-h-fit">
          <div>RM</div>
          <div className="font-bold">{totalAmount.toFixed(2).toString()}</div>
        </div>
      </div>
      <CheckoutButton />
    </div>
  );
}
