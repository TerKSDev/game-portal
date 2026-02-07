"use client";

import { useState } from "react";
import Image from "next/image";
import {
  FaCoins,
  FaShoppingCart,
  FaMoneyBillWave,
  FaUndo,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";

interface PurchasedGame {
  gameId: number;
  name: string;
  image: string;
  price: string;
}

interface Transaction {
  id: string;
  type: "Purchase" | "Top_Up" | "Refund";
  amount: number;
  cashAmount: number | null;
  description: string | null;
  status: string;
  createdAt: string;
  purchasedGames?: PurchasedGame[];
}

interface TransactionHistoryProps {
  transactions: Transaction[];
}

export default function TransactionHistory({
  transactions,
}: TransactionHistoryProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Purchase":
        return <FaShoppingCart className="text-zinc-400" size={20} />;
      case "Top_Up":
        return <FaCoins className="text-yellow-500" size={20} />;
      case "Refund":
        return <FaUndo className="text-emerald-500" size={20} />;
      default:
        return <FaMoneyBillWave className="text-zinc-500" size={20} />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Purchase":
        return "text-zinc-200";
      case "Top_Up":
        return "text-yellow-400";
      case "Refund":
        return "text-emerald-400";
      default:
        return "text-zinc-400";
    }
  };

  const getStatusBadge = (status: string) => {
    const statusLower = status.toLowerCase();
    if (statusLower === "success" || statusLower === "completed") {
      return (
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
          Success
        </span>
      );
    } else if (statusLower === "pending") {
      return (
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
          Pending
        </span>
      );
    } else if (statusLower === "failed") {
      return (
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-500/20 text-red-400 border border-red-500/30">
          Failed
        </span>
      );
    }
    return (
      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-zinc-500/20 text-zinc-400 border border-zinc-500/30">
        {status}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-MY", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-96 gap-8">
        <FaMoneyBillWave size={64} className="text-zinc-600" />
        <div className="text-center gap-1.5">
          <p className="text-zinc-400 text-xl">No transaction history</p>
          <p className="text-zinc-500 text-sm">
            Your purchases and top-ups will appear here
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {transactions.map((transaction) => (
        <div
          key={transaction.id}
          className="bg-zinc-900/50 backdrop-blur-md border border-zinc-800/80 rounded-2xl shadow-2xl hover:border-zinc-700/80 transition-all duration-300"
        >
          <div className="p-6">
            <div className="flex items-start justify-between gap-4">
              {/* Left: Icon and Details */}
              <div className="flex gap-4 flex-1">
                <div className="flex-shrink-0 mt-1">
                  {getTypeIcon(transaction.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3
                      className={`text-lg font-semibold ${getTypeColor(transaction.type)}`}
                    >
                      {transaction.type.replace("_", " ")}
                    </h3>
                    {getStatusBadge(transaction.status)}
                  </div>

                  {transaction.description && (
                    <p className="text-zinc-400 text-sm mb-2 line-clamp-2">
                      {transaction.description}
                    </p>
                  )}

                  <p className="text-zinc-500 text-xs">
                    {formatDate(transaction.createdAt)}
                  </p>
                </div>
              </div>

              {/* Right: Amount */}
              <div className="text-right flex-shrink-0">
                {transaction.type === "Purchase" ? (
                  <div className="space-y-1">
                    {transaction.cashAmount !== null &&
                      transaction.cashAmount > 0 && (
                        <p className="text-xl font-bold text-red-400">
                          - RM {transaction.cashAmount.toFixed(2)}
                        </p>
                      )}
                    {transaction.amount > 0 && (
                      <div className="flex items-center justify-end gap-1.5">
                        <FaCoins className="text-yellow-500" size={14} />
                        <p className="text-sm font-semibold text-red-400">
                          - {transaction.amount.toLocaleString()}
                        </p>
                      </div>
                    )}
                    {transaction.cashAmount === null &&
                      transaction.amount === 0 && (
                        <p className="text-sm text-zinc-500">Free</p>
                      )}
                  </div>
                ) : transaction.type === "Top_Up" ? (
                  <div className="space-y-1">
                    {transaction.cashAmount !== null &&
                      transaction.cashAmount > 0 && (
                        <p className="text-xl font-bold text-zinc-400">
                          RM {transaction.cashAmount.toFixed(2)}
                        </p>
                      )}
                    <div className="flex items-center justify-end gap-1.5">
                      <FaCoins className="text-yellow-500" size={16} />
                      <p className="text-xl font-bold text-emerald-400">
                        + {transaction.amount.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ) : transaction.type === "Refund" ? (
                  <div className="space-y-1">
                    {transaction.cashAmount !== null &&
                      transaction.cashAmount > 0 && (
                        <p className="text-xl font-bold text-emerald-400">
                          + RM {transaction.cashAmount.toFixed(2)}
                        </p>
                      )}
                    {transaction.amount > 0 && (
                      <div className="flex items-center justify-end gap-1.5">
                        <FaCoins className="text-yellow-500" size={14} />
                        <p className="text-sm font-semibold text-emerald-400">
                          + {transaction.amount.toLocaleString()}
                        </p>
                      </div>
                    )}
                  </div>
                ) : null}
              </div>
            </div>

            {/* Purchased Games Details (for Purchase transactions) */}
            {transaction.type === "Purchase" &&
              transaction.purchasedGames &&
              transaction.purchasedGames.length > 0 && (
                <div className="mt-4">
                  <button
                    onClick={() => toggleExpand(transaction.id)}
                    className="flex items-center gap-2 text-sm text-zinc-300 hover:text-zinc-200 transition-colors"
                  >
                    {expandedId === transaction.id ? (
                      <>
                        <FaChevronUp size={12} />
                        <span>Hide Details</span>
                      </>
                    ) : (
                      <>
                        <FaChevronDown size={12} />
                        <span>
                          View {transaction.purchasedGames.length} Game
                          {transaction.purchasedGames.length > 1 ? "s" : ""}
                        </span>
                      </>
                    )}
                  </button>

                  {expandedId === transaction.id && (
                    <div className="mt-4 pt-4 border-t border-zinc-800/80 space-y-3">
                      {transaction.purchasedGames.map((game) => (
                        <div
                          key={game.gameId}
                          className="flex items-center gap-3 p-3 bg-zinc-800/50 rounded-xl"
                        >
                          <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                            <Image
                              src={game.image}
                              alt={game.name}
                              width={64}
                              height={64}
                              className="object-cover w-full h-full"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-white font-medium truncate">
                              {game.name}
                            </p>
                            <p className="text-zinc-400 text-sm">
                              {game.price}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
          </div>
        </div>
      ))}
    </div>
  );
}
