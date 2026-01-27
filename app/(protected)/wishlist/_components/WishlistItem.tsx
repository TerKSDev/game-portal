"use client";

import Image from "next/image";
import Link from "next/link";
import { WishlistItemProps } from "../page";
import { RemoveButton, AddToCartButton } from "./Button";
import { PATHS } from "@/app/_config/routes";

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
    <div className="flex flex-col w-full bg-gray-900 border-2 border-gray-800 rounded-lg p-2 font-mono max-w-4xl">
      <div className="flex flex-row lg:justify-between max-lg:flex-col gap-4\">
        <div className="flex flex-row max-lg:flex-col gap-x-4 gap-y-2">
          <div className="w-52 aspect-video relative">
            <Image
              src={item.image}
              alt="Wishlist Item"
              fill
              className="rounded border border-gray-800 object-cover"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Link
              href={`${PATHS.DETAILS}/${item.gameId}`}
              className="text-xl font-bold hover:underline hover:underline-offset-8"
            >
              {item.name}
            </Link>
            <div className="flex flex-col gap-1">
              <p className="text-xs text-gray-300">
                Price: <span className="font-normal">RM {item.price}</span>
              </p>
              <p className="text-xs text-gray-300">
                Added on: <span className="font-normal">{item.addedAt}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-row gap-5 min-h-full items-end p-1 px-2 text-nowrap max-lg:w-full max-lg:justify-end">
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
