"use client";
import { useState } from "react";
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

  const handleWishlistButtonClick = async () => {
    try {
      const result = await AddToCart({ game });

      if (result.success) {
        alert("Add to cart successfully!");
        setIsCartAdded(true);
      } else {
        alert("Removed from cart successfully!");
        setIsCartAdded(false);
      }
    } catch (error) {
      console.log("Error adding to cart:", error);
    }
  };

  return (
    <button
      type="button"
      onClick={() => handleWishlistButtonClick()}
      className={`flex flex-row gap-x-3 w-full py-3 rounded-lg justify-center items-center text-sm font-semibold transition-all duration-300 shadow-lg ${
        isCartAdded
          ? "bg-gray-700 hover:bg-gray-600 border border-gray-600"
          : "bg-linear-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 hover:shadow-blue-500/50"
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

  const handleWishlistButtonClick = async () => {
    try {
      const result = await AddToWishlist({ game });

      if (result && result.success) {
        alert("Add to wishlist successfully!");
        setIsWishlistAdded(true);
      } else {
        alert("Removed from wishlist successfully!");
        setIsWishlistAdded(false);
      }
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
      className={`flex flex-row py-3 items-center justify-center rounded-lg w-full gap-x-3 text-sm font-semibold transition-all duration-300 shadow-lg ${
        isWishlistAdded
          ? "bg-gray-700 hover:bg-gray-600 border border-gray-600"
          : "bg-linear-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 hover:shadow-yellow-500/50"
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
      className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 border border-green-500/50 flex flex-row gap-x-3 py-3 rounded-lg justify-center items-center text-sm font-semibold transition-all duration-300 shadow-lg hover:shadow-green-500/50"
    >
      <BiSolidPurchaseTag size={18} />
      <p>Purchased</p>
    </button>
  );
}
