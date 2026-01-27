'use client";';

import { RemoveFromCart } from "./buttonOnClick";
import { useRouter } from "next/navigation";
import { PATHS } from "@/app/_config/routes";

export function RemoveButton({ id }: { id: string }) {
  const handleRemove = async () => {
    const res = await RemoveFromCart(id);

    if (res.success) {
      // Optionally, you can add some UI feedback here
      alert("Item removed from cart.");
    }
  };

  return (
    <button
      onClick={handleRemove}
      className="text-gray-300 text-xs p-1 px-2 rounded self-end hover:text-gray-400 hover:underline hover:underline-offset-4 transition"
    >
      Remove
    </button>
  );
}

export function CheckoutButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push(PATHS.CHECKOUT)}
      className="bg-blue-600 text-white font-bold p-2 rounded hover:bg-blue-700 transition"
    >
      Proceed to Checkout
    </button>
  );
}
