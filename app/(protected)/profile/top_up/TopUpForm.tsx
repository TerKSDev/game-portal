"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaCoins } from "react-icons/fa";

interface TopUpFormProps {
  currentOrbs: number;
}

const PRESET_AMOUNTS = [
  { orbs: 100, price: 1.0, bonus: 0 },
  { orbs: 500, price: 5.0, bonus: 50 },
  { orbs: 1000, price: 10.0, bonus: 150 },
  { orbs: 2500, price: 25.0, bonus: 500 },
  { orbs: 5000, price: 50.0, bonus: 1000 },
  { orbs: 10000, price: 100.0, bonus: 2500 },
];

export default function TopUpForm({ currentOrbs }: TopUpFormProps) {
  const router = useRouter();
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleTopUp = async () => {
    if (!selectedAmount) {
      alert("Please select an amount");
      return;
    }

    const preset = PRESET_AMOUNTS.find((p) => p.orbs === selectedAmount);
    if (!preset) return;

    setIsProcessing(true);

    try {
      const res = await fetch("/api/topup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orbs: selectedAmount + preset.bonus,
          price: parseFloat(preset.price.toFixed(2)),
        }),
      });

      if (res.status === 401) {
        router.push("/login");
        return;
      }

      const data = await res.json();

      if (!res.ok) {
        console.error("Top-up error:", data);
        alert(
          `Failed to create checkout session: ${data.details || data.error}`,
        );
        return;
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const selectedPreset = PRESET_AMOUNTS.find((p) => p.orbs === selectedAmount);
  const totalOrbs = selectedAmount
    ? selectedAmount + (selectedPreset?.bonus || 0)
    : 0;
  const totalPrice = selectedPreset?.price || 0;

  return (
    <div className="flex flex-col gap-6">
      {/* Current Balance */}
      <div className="bg-zinc-900/50 backdrop-blur-md border border-zinc-800/80 p-6 rounded-2xl shadow-2xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-zinc-400 text-sm mb-1">Current Balance</p>
            <div className="flex items-center gap-2">
              <FaCoins className="text-yellow-500" size={24} />
              <p className="text-3xl font-bold text-white">{currentOrbs}</p>
              <span className="text-zinc-400">Orbs</span>
            </div>
          </div>
        </div>
      </div>

      {/* Preset Amounts */}
      <div className="bg-zinc-900/50 backdrop-blur-md border border-zinc-800/80 p-6 rounded-2xl shadow-2xl">
        <h2 className="text-xl font-bold mb-4 text-zinc-200">Select Amount</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {PRESET_AMOUNTS.map((preset) => (
            <button
              key={preset.orbs}
              onClick={() => setSelectedAmount(preset.orbs)}
              className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                selectedAmount === preset.orbs
                  ? "border-zinc-600 bg-zinc-800 shadow-lg"
                  : "border-zinc-700/50 bg-zinc-800/50 hover:border-zinc-600"
              }`}
            >
              <div className="flex flex-col items-center gap-2">
                <FaCoins className="text-yellow-500" size={32} />
                <p className="text-2xl font-bold text-white">{preset.orbs}</p>
                {preset.bonus > 0 && (
                  <p className="text-xs text-emerald-400 font-semibold">
                    +{preset.bonus} Bonus
                  </p>
                )}
                <p className="text-sm text-zinc-400">
                  RM {preset.price.toFixed(2)}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Summary and Purchase */}
      <div className="bg-zinc-900/50 backdrop-blur-md border border-zinc-800/80 p-6 rounded-2xl shadow-2xl">
        <h2 className="text-xl font-bold mb-4 text-zinc-200">Order Summary</h2>
        <div className="space-y-3 mb-6">
          <div className="flex justify-between text-zinc-400">
            <span>Base Orbs:</span>
            <span className="text-white font-semibold">
              {selectedAmount || 0}
            </span>
          </div>
          {selectedPreset && selectedPreset.bonus > 0 && (
            <div className="flex justify-between text-zinc-400">
              <span>Bonus Orbs:</span>
              <span className="text-emerald-400 font-semibold">
                +{selectedPreset.bonus}
              </span>
            </div>
          )}
          <div className="border-t border-zinc-800 pt-3 space-y-3">
            <div className="flex justify-between">
              <span className="text-lg font-semibold text-white">
                Total Orbs:
              </span>
              <div className="flex items-center gap-2">
                <FaCoins className="text-yellow-500" size={20} />
                <span className="text-2xl font-bold text-white">
                  {totalOrbs}
                </span>
                <span className="text-zinc-400">Orbs</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold text-white">Price:</span>
              <span className="text-2xl font-bold text-zinc-200">
                RM {totalPrice.toFixed(2)}
              </span>
            </div>
          </div>

          <div className="bg-zinc-800/50 border border-zinc-700/80 rounded-xl p-3 mt-4">
            <div className="text-sm text-zinc-300">
              <p className="font-semibold text-white mb-1">
                Payment Methods Available:
              </p>
              <ul className="list-disc list-inside text-zinc-400 space-y-1">
                <li>Credit/Debit Card</li>
                <li>FPX (Online Banking)</li>
                <li>GrabPay</li>
                <li>Alipay</li>
              </ul>
            </div>
          </div>
        </div>

        <button
          onClick={handleTopUp}
          disabled={isProcessing || !selectedAmount}
          className="w-full bg-linear-to-r from-yellow-600 to-orange-600 hover:from-yellow-500 hover:to-orange-500 disabled:from-zinc-700 disabled:to-zinc-600 disabled:cursor-not-allowed px-6 py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-yellow-500/50 disabled:shadow-none"
        >
          {isProcessing ? "Processing..." : "Proceed to Payment"}
        </button>
      </div>
    </div>
  );
}
