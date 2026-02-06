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

  return (
    <div className="flex flex-col w-full bg-gray-900/80 backdrop-blur-md border border-gray-700/50 rounded-xl p-5 shadow-lg hover:border-gray-600/50 transition-all">
      <div className="flex flex-row lg:justify-between max-lg:flex-col gap-6">
        <div className="flex flex-row max-lg:flex-col gap-x-5 gap-y-4 flex-1">
          <div className="w-56 max-lg:w-full aspect-video relative rounded-lg overflow-hidden shadow-md border border-gray-700/50 shrink-0">
            <Image
              src={item.image}
              alt={item.name}
              fill
              className="object-cover"
            />
          </div>

          <div className="flex flex-col gap-3 flex-1">
            <Link
              href={`${PATHS.DETAILS}/${item.gameId}`}
              className="text-xl font-semibold hover:text-blue-400 transition-colors line-clamp-2"
            >
              {item.name}
            </Link>
            <div className="flex flex-col gap-2">
              <div className="text-2xl font-bold text-blue-400">
                {item.price}
              </div>
              <p className="text-sm text-gray-400">
                Added on {formatDate(item.addedAt)}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-row gap-3 items-end max-lg:justify-end">
          {!item.isAddedToCart && (
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
