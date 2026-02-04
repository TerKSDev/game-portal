"use client";

import Link from "next/link";
import { FaCheckCircle, FaCoins } from "react-icons/fa";
import { PATHS } from "@/app/_config/routes";

interface TopUpSuccessProps {
  orbsAdded: number;
  currentBalance: number;
}

export default function TopUpSuccess({
  orbsAdded,
  currentBalance,
}: TopUpSuccessProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-8">
      <div className="bg-gray-900/80 backdrop-blur-md border border-gray-700/50 p-8 rounded-xl shadow-2xl max-w-md w-full">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <FaCheckCircle className="text-green-500 text-6xl animate-pulse" />
          </div>

          <div className="text-center">
            <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              Top-up Successful!
            </h1>
            <p className="text-gray-400">
              Your payment has been processed successfully
            </p>
          </div>

          <div className="w-full border-t border-gray-700 pt-6 space-y-4">
            <div className="bg-gradient-to-r from-green-600/10 to-emerald-600/10 border border-green-600/30 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Orbs Added:</span>
                <div className="flex items-center gap-2">
                  <FaCoins className="text-yellow-500" size={20} />
                  <span className="text-2xl font-bold text-green-400">
                    +{orbsAdded.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-gray-800/50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Current Balance:</span>
                <div className="flex items-center gap-2">
                  <FaCoins className="text-yellow-500" size={20} />
                  <span className="text-xl font-bold text-white">
                    {currentBalance.toLocaleString()}
                  </span>
                  <span className="text-gray-400">Orbs</span>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full flex flex-col gap-3 mt-4">
            <Link
              href={PATHS.STORE}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 px-6 py-3 rounded-lg font-semibold text-center transition-all duration-300 shadow-lg hover:shadow-blue-500/50"
            >
              Browse Games
            </Link>
            <Link
              href="/profile"
              className="w-full bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded-lg font-semibold text-center transition-all duration-300"
            >
              Back to Profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
