"use client";

import { CheckoutButton } from "./Button";
import { useState } from "react";

export default function SummaryCard({
  totalAmount,
  userOrbs,
}: {
  totalAmount: number;
  userOrbs: number;
}) {
  const [useOrbs, setUseOrbs] = useState(false);

  // Validate input
  const validTotalAmount =
    typeof totalAmount === "number" && !isNaN(totalAmount) ? totalAmount : 0;
  const validUserOrbs =
    typeof userOrbs === "number" && !isNaN(userOrbs) ? userOrbs : 0;

  // Convert total to Orbs (100 Orbs = RM 1)
  const totalInOrbs = validTotalAmount * 100;
  const canUseOrbs = validUserOrbs >= 100;

  // Calculate how many Orbs to use (limited by both user's orbs and total needed)
  const orbsToUse = Math.min(validUserOrbs, totalInOrbs);

  // Calculate discount in RM (100 Orbs = RM 1)
  const orbsDiscount = useOrbs && canUseOrbs ? orbsToUse / 100 : 0;

  // Calculate final total, ensure it's never negative or NaN
  let finalTotal = validTotalAmount - orbsDiscount;
  if (isNaN(finalTotal) || finalTotal < 0) {
    finalTotal = 0;
  }

  const remainingOrbs = useOrbs ? validUserOrbs - orbsToUse : validUserOrbs;

  // Calculate Orbs reward (5% of total amount) - only if not using Orbs
  const orbsReward = !useOrbs ? Math.floor(validTotalAmount * 0.05 * 100) : 0;

  return (
    <div className="flex flex-col flex-1 bg-zinc-900/50 backdrop-blur-md border border-zinc-800/80 p-6 rounded-2xl shadow-2xl gap-6 h-fit lg:sticky lg:top-24">
      <h2 className="font-bold text-xl bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
        Order Summary
      </h2>

      <div className="flex flex-col gap-4">
        {/* Subtotal */}
        <div className="flex flex-row justify-between items-center text-zinc-300 mb-2">
          <span className="text-sm">Subtotal</span>
          <span className="font-semibold">
            RM {validTotalAmount.toFixed(2)}
          </span>
        </div>

        {/* Orbs Balance */}
        <div className="bg-linear-to-r from-yellow-600/10 to-orange-600/10 border border-yellow-600/30 rounded-xl p-3 mb-2">
          <div className="flex flex-row justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-linear-to-r from-yellow-400 to-orange-400 shadow-lg shadow-yellow-500/50"></div>
              <span className="text-sm text-zinc-300">Your Orbs</span>
            </div>
            <span className="font-bold bg-linear-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              {validUserOrbs.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Use Orbs Toggle */}
        <div className="flex flex-col gap-1.5">
          <label
            className={`flex items-center gap-3 ${canUseOrbs ? "cursor-pointer" : "cursor-not-allowed opacity-60"} group`}
          >
            <div className="relative">
              <input
                type="checkbox"
                checked={useOrbs}
                onChange={(e) => setUseOrbs(e.target.checked)}
                disabled={!canUseOrbs}
                className="sr-only peer"
              />
              <div
                className={`w-11 h-6 bg-gray-700 rounded-full peer peer-checked:bg-linear-to-r peer-checked:from-yellow-600 peer-checked:to-orange-600 transition-all duration-300 ${!canUseOrbs && "opacity-50"}`}
              ></div>
              <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 peer-checked:translate-x-5"></div>
            </div>
            <span className="text-sm text-zinc-300 group-hover:text-zinc-200 transition-colors">
              Use Orbs to pay
            </span>
          </label>

          {!canUseOrbs && (
            <div className="ml-14 text-xs text-red-400">
              Minimum 100 Orbs required
            </div>
          )}

          {useOrbs && canUseOrbs && (
            <div className="ml-14 text-xs text-zinc-400 space-y-1 animate-in fade-in slide-in-from-top-2 duration-300">
              <p>
                Using {orbsToUse.toLocaleString()} Orbs ( -RM{" "}
                {orbsDiscount.toFixed(2)} )
              </p>
              <p>Remaining: {remainingOrbs.toLocaleString()} Orbs</p>
            </div>
          )}
        </div>

        {/* Orbs Reward if not using Orbs */}
        {!useOrbs && orbsReward > 0 && (
          <div className="bg-linear-to-r from-green-600/10 to-emerald-600/10 border border-green-600/30 rounded-xl p-3 mt-2">
            <div className="flex flex-row justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-linear-to-r from-green-400 to-emerald-400 shadow-lg shadow-green-500/50"></div>
                <span className="text-sm text-zinc-300">Orbs Reward (5%)</span>
              </div>
              <span className="font-bold bg-linear-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
                +{orbsReward.toLocaleString()} Orbs
              </span>
            </div>
          </div>
        )}

        {/* Discount if using Orbs */}
        {useOrbs && orbsDiscount > 0 && (
          <div className="flex flex-row justify-between items-center text-green-400">
            <span className="text-sm">Orbs Discount</span>
            <span className="font-semibold">
              - RM {orbsDiscount.toFixed(2)}
            </span>
          </div>
        )}

        {/* Total */}
        <div className="border-t border-zinc-700 pt-4 mt-4">
          <div className="flex flex-row justify-between items-center">
            <span className="text-base sm:text-lg font-bold text-zinc-200">
              Total
            </span>
            <span className="text-xl sm:text-2xl font-bold bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              RM {finalTotal.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      <CheckoutButton
        finalPrice={finalTotal}
        isUseOrbs={useOrbs}
        orbsUsage={useOrbs ? orbsToUse : 0}
      />
    </div>
  );
}
