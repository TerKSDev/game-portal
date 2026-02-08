"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PATHS } from "@/app/_config/routes";
import { AddToCart, AddToWishlist, AddProps } from "./buttonOnClick";
import { useNotification } from "@/app/components/Notification";

import { TiStarOutline, TiStarFullOutline } from "react-icons/ti";
import { BiSolidPurchaseTag } from "react-icons/bi";
import { FaShoppingCart } from "react-icons/fa";

type ButtonProps = AddProps & {
  initialState: boolean;
};

export function AddToCartButton({ game, initialState = false }: ButtonProps) {
  const [isCartAdded, setIsCartAdded] = useState(initialState);
  const router = useRouter();
  const { showSuccess, showError } = useNotification();

  useEffect(() => {
    setIsCartAdded(initialState);
  }, [initialState]);

  const handleCartButtonClick = async () => {
    // Optimistic UI: Update state immediately
    const previousState = isCartAdded;
    const newState = !isCartAdded;

    setIsCartAdded(newState);

    // Show notification immediately
    if (newState) {
      showSuccess("Game added to cart successfully!", "Cart Updated");
    } else {
      showSuccess("Game removed from cart successfully!", "Cart Updated");
    }

    // Trigger sidebar refresh immediately
    window.dispatchEvent(new Event("refreshUserStats"));

    try {
      // Execute server action in background
      const result = await AddToCart({ game });

      // Verify server state matches our optimistic update
      if (result.success !== newState) {
        // Rollback if server state doesn't match
        setIsCartAdded(previousState);
        window.dispatchEvent(new Event("refreshUserStats"));
      }

      router.refresh();
    } catch (error) {
      console.log("Error adding to cart:", error);
      // Rollback on error
      setIsCartAdded(previousState);
      showError("Failed to update cart. Please try again.", "Error");
      window.dispatchEvent(new Event("refreshUserStats"));
    }
  };

  return (
    <button
      type="button"
      onClick={() => handleCartButtonClick()}
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
  const { showSuccess, showError } = useNotification();

  useEffect(() => {
    setIsWishlistAdded(initialState);
  }, [initialState]);

  const handleWishlistButtonClick = async () => {
    // Optimistic UI: Update state immediately
    const previousState = isWishlistAdded;
    const newState = !isWishlistAdded;

    setIsWishlistAdded(newState);

    // Show notification immediately
    if (newState) {
      showSuccess("Game added to wishlist successfully!", "Wishlist Updated");
    } else {
      showSuccess(
        "Game removed from wishlist successfully!",
        "Wishlist Updated",
      );
    }

    // Trigger sidebar refresh immediately
    window.dispatchEvent(new Event("refreshUserStats"));

    try {
      // Execute server action in background
      const result = await AddToWishlist({ game });

      // Verify server state matches our optimistic update
      if (result && result.success !== newState) {
        // Rollback if server state doesn't match
        setIsWishlistAdded(previousState);
        window.dispatchEvent(new Event("refreshUserStats"));
      }

      router.refresh();
    } catch (error) {
      console.log("Error adding to wishlist:", error);
      // Rollback on error
      setIsWishlistAdded(previousState);
      showError("Failed to update wishlist. Please try again.", "Error");
      window.dispatchEvent(new Event("refreshUserStats"));
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
