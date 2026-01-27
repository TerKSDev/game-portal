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
      className={`flex flex-row gap-x-3 w-full py-2 rounded justify-center items-center text-sm ${isCartAdded ? "bg-gray-700 hover:bg-gray-600" : "bg-blue-500 hover:bg-blue-600"}`}
    >
      <FaShoppingCart />
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
      className={`flex flex-row  py-2 items-center justify-center rounded w-full gap-x-3 text-sm ${isWishlistAdded ? "bg-gray-700 hover:bg-gray-600" : "bg-yellow-500 hover:bg-yellow-600"}`}
    >
      {isWishlistAdded ? <TiStarFullOutline /> : <TiStarOutline />}
      <p>{isWishlistAdded ? "Added" : "Add To Wishlist"}</p>
    </button>
  );
}

export function PurchasedButton() {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push(PATHS.LIBRARY)}
      className="w-full bg-gray-700 hover:bg-gray-600 flex flex-row gap-x-3 py-2 rounded justify-center items-center text-sm"
    >
      <BiSolidPurchaseTag />
      <p>Purchased</p>
    </button>
  );
}
