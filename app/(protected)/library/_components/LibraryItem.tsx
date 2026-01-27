"use client";
import { LibraryProps } from "../page";
import Image from "next/image";

export default function LibraryItem({
  itemDetails,
}: {
  itemDetails: LibraryProps;
}) {
  return (
    <div className="flex flex-row items-center gap-2 p-2 px-4 text-xs truncate line-clamp-1 min-w-full">
      <Image
        src={itemDetails.image}
        alt={itemDetails.name}
        width={30}
        height={30}
        className="aspect-video rounded-lg object-cover"
      />
      <p>{itemDetails.name}</p>
    </div>
  );
}
