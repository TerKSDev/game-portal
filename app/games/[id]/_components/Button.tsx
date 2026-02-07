"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PATHS } from "@/app/_config/routes";
import { AddToCart, AddToWishlist, AddProps } from "./buttonOnClick";

import { TiStarOutline, TiStarFullOutline } from "react-icons/ti";
import { BiSolidPurchaseTag } from "react-icons/bi";
import { FaShoppingCart } from "react-icons/fa";

type ButtonProps = AddProps & {
  initialState: boolean;
};

export function AddToCartButton({ game, initialState = false }: ButtonProps) {
  const [isCartAdded, setIsCartAdded] = useState(initialState);
  const router = useRouter();

  useEffect(() => {
    setIsCartAdded(initialState);
  }, [initialState]);

  const handleWishlistButtonClick = async () => {
    try {
      const result = await AddToCart({ game });

      if (result.success) {
        alert("Add to cart successfully!");
      } else {
        alert("Removed from cart successfully!");
      }
      router.refresh();
      // Trigger sidebar refresh after a small delay to ensure DB update completes
      setTimeout(() => {
        window.dispatchEvent(new Event("refreshUserStats"));
      }, 100);
    } catch (error) {
      console.log("Error adding to cart:", error);
    }
  };

  return (
    <button
      type="button"
      onClick={() => handleWishlistButtonClick()}
      className={`flex flex-row gap-x-3 w-full py-3 rounded-xl justify-center items-center text-sm font-bold transition-all duration-300 shadow-lg ${
        isCartAdded
          ? "bg-zinc-700 hover:bg-zinc-600 border border-zinc-600"
          : "bg-linear-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 border border-blue-500/30"
      }`}
    >
      <FaShoppingCart size={16} />
      <p>{isCartAdded ? "Added" : "Add To Cart"}</p>
    </button>
  );
}

export function AddToWishlistButton({
  game,
  initialState = false,
}: ButtonProps) {
  const [isWishlistAdded, setIsWishlistAdded] = useState(initialState);
  const router = useRouter();

  useEffect(() => {
    setIsWishlistAdded(initialState);
  }, [initialState]);

  const handleWishlistButtonClick = async () => {
    try {
      const result = await AddToWishlist({ game });

      if (result && result.success) {
        alert("Add to wishlist successfully!");
      } else {
        alert("Removed from wishlist successfully!");
      }
      router.refresh();
      // Trigger sidebar refresh after a small delay to ensure DB update completes
      setTimeout(() => {
        window.dispatchEvent(new Event("refreshUserStats"));
      }, 100);
    } catch (error) {
      console.log("Error adding to wishlist:", error);
    }
  };

  return (
    <button
      type="button"
      onClick={() => {
        handleWishlistButtonClick();
      }}
      className={`flex flex-row py-3 items-center justify-center rounded-xl w-full gap-x-3 text-sm font-bold transition-all duration-300 shadow-lg ${
        isWishlistAdded
          ? "bg-zinc-700 hover:bg-zinc-600 border border-zinc-600"
          : "bg-linear-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 border border-orange-500/30"
      }`}
    >
      {isWishlistAdded ? (
        <TiStarFullOutline size={18} />
      ) : (
        <TiStarOutline size={18} />
      )}
      <p>{isWishlistAdded ? "Added" : "Add To Wishlist"}</p>
    </button>
  );
}

export function PurchasedButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push(PATHS.LIBRARY)}
      className="w-full bg-zinc-700 hover:bg-zinc-600 border border-zinc-600 flex flex-row gap-x-3 py-3 rounded-xl justify-center items-center text-sm font-bold transition-all duration-300 shadow-lg"
    >
      <BiSolidPurchaseTag size={18} />
      <p>Purchased</p>
    </button>
  );
}
