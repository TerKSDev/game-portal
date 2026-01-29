"use client";

import Image from "next/image";
import Link from "next/link";

import { PATHS } from "@/app/_config/routes";
import { RemoveButton } from "./Button";

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
    <div className="flex flex-row justify-between bg-gray-900/80 backdrop-blur-md border border-gray-700/50 p-4 rounded-xl shadow-lg hover:border-gray-600/50 transition-all">
      <div className="flex flex-1 gap-4">
        <div className="relative w-50 aspect-video rounded-lg overflow-hidden shadow-md border border-gray-700/50 shrink-0">
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
              className="text-lg font-semibold hover:text-blue-400 transition-colors line-clamp-2"
            >
              {item.name}
            </Link>
            <p className="text-sm text-gray-400 mt-1">Added: {item.addedAt}</p>
          </div>
          <div className="flex items-center gap-4 text-xl font-bold">
            <p className="text-blue-400">RM {item.price.toFixed(2)}</p>
            <div className="flex items-center gap-1.5 text-sm bg-linear-to-r from-yellow-600/20 to-orange-600/20 border border-yellow-600/30 rounded-lg px-3 py-1.5">
              <div className="w-2 h-2 rounded-full bg-linear-to-r from-yellow-400 to-orange-400 shadow-lg shadow-yellow-500/50"></div>
              <p className="font-bold bg-linear-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                {(item.price * 100).toLocaleString()} Orbs
              </p>
            </div>
          </div>
        </div>
      </div>

      <RemoveButton key={item.id} id={item.id} />
    </div>
  );
}
