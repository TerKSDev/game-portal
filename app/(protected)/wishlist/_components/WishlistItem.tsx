"use client";

import Image from "next/image";
import Link from "next/link";
import { WishlistItemProps } from "../page";
import { RemoveButton, AddToCartButton } from "./Button";
import { PATHS } from "@/app/_config/routes";

// Helper function to format date consistently on client
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

type WishlistItemComponentProps = {
  item: WishlistItemProps;
};

export default function WishlistItem({ item }: WishlistItemComponentProps) {
  const cartItemDetails = {
    gameId: item.gameId,
    gameUrl: item.gameUrl,
    name: item.name,
    image: item.image,
    price: item.price,
  };

  const showAddCart = !item.isAddedToCart && item.price !== "N/A";

  return (
    <div className="flex flex-col w-full bg-zinc-900/50 backdrop-blur-md border border-zinc-800/80 rounded-2xl p-6 shadow-xl hover:border-zinc-700/80 hover:shadow-2xl transition-all duration-300 group">
      <div className="flex flex-row lg:justify-between max-lg:flex-col gap-6">
        <div className="flex flex-row max-lg:flex-col gap-x-6 gap-y-4 flex-1">
          <div className="w-64 max-lg:w-full aspect-video relative rounded-xl overflow-hidden shadow-lg border border-zinc-700/50 shrink-0 group-hover:border-zinc-600 transition-all">
            <Image
              src={item.image}
              alt={item.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>

          <div className="flex flex-col gap-3 flex-1 justify-start py-1">
            <Link
              href={`${PATHS.DETAILS}/${item.gameId}`}
              className="text-xl sm:text-2xl font-bold text-white hover:text-blue-400 transition-colors line-clamp-2 group-hover:text-blue-400"
            >
              {item.name}
            </Link>
            <div className="flex flex-col gap-2">
              <div className="text-3xl font-black bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                {item.price}
              </div>
              <div className="flex items-center gap-2 text-sm text-zinc-500">
                <span className="w-1.5 h-1.5 rounded-full bg-zinc-600"></span>
                <p>Added on {formatDate(item.addedAt)}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-row gap-3 items-end max-lg:justify-end">
          {showAddCart && (
            <AddToCartButton
              key={`Add: ${item.id}`}
              itemDetails={cartItemDetails}
            />
          )}
          <RemoveButton key={`Remove: ${item.id}`} itemId={item.id} />
        </div>
      </div>
    </div>
  );
}
