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
      className="cursor-pointer text-[10px] text-gray-400 hover:text-gray-500 hover:underline hover:underline-offset-4"
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
      className="cursor-pointer text-[10px] text-gray-400 hover:text-gray-500 hover:underline hover:underline-offset-4"
    >
      Add to Cart
    </button>
  );
}
