'use client";';

import { RemoveFromCart, HandleCheckout } from "./buttonOnClick";
import { useRouter } from "next/navigation";
import { PATHS } from "@/app/_config/routes";
import { useNotification } from "@/app/components/Notification";

export function RemoveButton({ id }: { id: string }) {
  const { showSuccess, showConfirmation } = useNotification();

  const handleRemove = async () => {
    showConfirmation({
      title: "Remove Item",
      message: "Are you sure you want to remove this item from your cart?",
      confirmText: "Remove",
      cancelText: "Cancel",
      onConfirm: async () => {
        const res = await RemoveFromCart(id);

        if (res.success) {
          // Trigger SideNav stats refresh
          window.dispatchEvent(new Event("refreshUserStats"));
          showSuccess("Item removed from cart successfully!");
        }
      },
    });
  };

  return (
    <button
      onClick={handleRemove}
      className="text-red-400 hover:text-red-300 text-sm px-4 py-2 rounded-xl hover:bg-red-500/10 transition-all self-start border border-transparent hover:border-red-500/30 font-bold ml-auto shadow-lg"
    >
      Remove
    </button>
  );
}

export function CheckoutButton({
  finalPrice,
  isUseOrbs,
  orbsUsage = 0,
}: {
  finalPrice: number;
  isUseOrbs: boolean;
  orbsUsage?: number;
}) {
  const router = useRouter();
  const { showError, showSuccess } = useNotification();

  const handleCheckout = async () => {
    try {
      // Debug log
      console.log("CheckoutButton received:", {
        finalPrice,
        isUseOrbs,
        orbsUsage,
      });

      // Validate inputs
      if (
        typeof finalPrice === "undefined" ||
        isNaN(finalPrice) ||
        finalPrice < 0
      ) {
        console.error("Invalid finalPrice:", finalPrice);
        showError(
          `Invalid price: ${finalPrice}. Please refresh and try again.`,
          "Checkout Error",
        );
        return;
      }

      // Use orbs for full payment
      if (finalPrice === 0 && isUseOrbs) {
        if (orbsUsage <= 0) {
          showError("Invalid Orbs usage amount.", "Checkout Error");
          return;
        }

        const result = await HandleCheckout(orbsUsage);

        if (result.success) {
          window.dispatchEvent(new Event("refreshUserStats"));
          router.push(`${PATHS.PAYMENT_SUCCESS}?paid_with_orbs=true`);
          return;
        } else {
          showError(
            result.message || "Failed to process payment with Orbs.",
            "Payment Failed",
          );
          return;
        }
      }

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          totalPrice: parseFloat(finalPrice.toFixed(2)),
          orbsUsed: isUseOrbs ? orbsUsage : 0,
        }),
      });

      if (res.status === 401) {
        router.push(PATHS.LOGIN);
        return;
      }

      const data = await res.json();

      if (!res.ok) {
        showError(
          data.details || data.error || "Failed to create checkout session",
          "Checkout Error",
        );
        return;
      }

      if (data.url) {
        window.location.href = data.url;
      } else {
        showError("Failed to create checkout session.", "Checkout Error");
      }
    } catch (error) {
      console.error("Checkout request error:", error);
      showError("Something went wrong during checkout.", "Checkout Error");
      alert("Something went wrong.");
    }
  };

  return (
    <button
      onClick={() => handleCheckout()}
      className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-blue-500/50 w-full"
    >
      Proceed to Checkout
    </button>
  );
}
