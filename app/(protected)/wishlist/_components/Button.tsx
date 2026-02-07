"use client";

import { RemoveFromWishlist, AddToCart } from "./buttonOnClick";
import { PATHS } from "@/app/_config/routes";
import { useState } from "react";

export interface AddToCartProps {
  itemDetails: {
    gameId: number;
    gameUrl: string;
    name: string;
    image: string;
    price: string;
  };
}

export function RemoveButton({ itemId }: { itemId: string }) {
  const remove = async () => {
    const res = await RemoveFromWishlist(itemId);

    if (res.success) {
      alert("Item removed from wishlist.");
    }
  };

  return (
    <button
      onClick={remove}
      className="text-red-400 hover:text-red-300 text-sm px-5 py-2.5 rounded-xl hover:bg-red-500/10 transition-all border border-zinc-700 hover:border-red-500/50 font-semibold"
    >
      Remove
    </button>
  );
}

export function AddToCartButton({ itemDetails }: AddToCartProps) {
  const addToCart = async () => {
    const res = await AddToCart({ itemDetails });

    if (res.success) {
      alert("Item added to cart.");
    }
  };

  return (
    <button
      onClick={addToCart}
      className="bg-linear-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white text-sm font-bold px-8 py-2.5 rounded-xl transition-all duration-300 shadow-lg hover:shadow-blue-500/50"
    >
      Add to Cart
    </button>
  );
}
