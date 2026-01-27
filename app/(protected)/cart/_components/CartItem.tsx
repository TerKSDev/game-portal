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
    <div className="flex flex-row justify-between bg-gray-700 p-1 rounded gap-4">
      <div className="flex flex-1 gap-4 p-0.5">
        <div className="relative w-48 aspect-video">
          <Image src={item.image} fill alt={item.name} />
        </div>
        <div className="flex flex-col flex-1">
          <Link
            href={`${PATHS.DETAILS}/${item.gameId}`}
            className="text-lg hover:underline hover:underline-offset-4"
          >
            {item.name}
          </Link>
          <div className="text-xs text-gray-300 flex flex-1 flex-col gap-4 justify-between px-px">
            <p>RM {item.price.toFixed(2).toString()}</p>
            <p>Added At: {item.addedAt}</p>
          </div>
        </div>
      </div>

      <RemoveButton key={item.id} id={item.id} />
    </div>
  );
}
