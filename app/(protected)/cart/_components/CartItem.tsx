"use client";

import Image from "next/image";
import Link from "next/link";

import { PATHS } from "@/app/_config/routes";
import { RemoveButton } from "./Button";

// Helper function to format date consistently on client
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

interface CartItemProps {
  id: string;
  name: string;
  price: number;
  gameId: number;
  gameUrl: string;
  userId: string;
  addedAt: string;
  image: string;
}

export default function CartItem({ item }: { item: CartItemProps }) {
  return (
    <div className="flex flex-col sm:flex-row justify-between bg-zinc-900/50 backdrop-blur-md border border-zinc-800/80 p-4 sm:p-5 rounded-2xl shadow-2xl hover:border-zinc-700/80 transition-all gap-4">
      <div className="flex flex-1 gap-4">
        <div className="relative w-50 aspect-video rounded-xl overflow-hidden shadow-md border border-zinc-800/80 shrink-0">
          <Image
            src={item.image}
            fill
            alt={item.name}
            className="object-cover"
          />
        </div>
        <div className="flex flex-col flex-1 justify-between">
          <div>
            <Link
              href={`${PATHS.DETAILS}/${item.gameId}`}
              className="text-base sm:text-lg font-semibold text-zinc-200 hover:text-blue-400 transition-colors line-clamp-2"
            >
              {item.name}
            </Link>
            <p className="text-xs sm:text-sm text-zinc-500 mt-1">
              Added: {formatDate(item.addedAt)}
            </p>
          </div>
          <div className="flex items-center gap-2 sm:gap-4 text-lg sm:text-xl font-bold">
            <p className="text-blue-400">
              {item.price === 0 ? "Free" : `RM ${item.price.toFixed(2)}`}
            </p>
            {item.price > 0 && (
              <div className="flex items-center gap-1.5 text-sm bg-linear-to-r from-yellow-600/20 to-orange-600/20 border border-yellow-600/30 rounded-lg px-3 py-1.5">
                <div className="w-2 h-2 rounded-full bg-linear-to-r from-yellow-400 to-orange-400 shadow-lg shadow-yellow-500/50"></div>
                <p className="font-bold bg-linear-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                  {(item.price * 100).toLocaleString()} Orbs
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <RemoveButton key={item.id} id={item.id} />
    </div>
  );
}
