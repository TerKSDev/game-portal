"use client";
import { LibraryProps } from "../page";
import Image from "next/image";

export default function LibraryItem({
  itemDetails,
  isSelected = false,
}: {
  itemDetails: LibraryProps;
  isSelected?: boolean;
}) {
  return (
    <div className="flex flex-row items-center gap-3 p-3 px-6 text-sm min-w-full group">
      <div className="relative w-16 h-9 shrink-0 rounded-lg overflow-hidden shadow-md border border-gray-700/50">
        <Image
          src={itemDetails.image}
          alt={itemDetails.name}
          fill
          className="object-cover"
        />
      </div>
      <p
        className={`line-clamp-2 transition-colors ${
          isSelected
            ? "text-blue-300 font-medium"
            : "text-gray-300 group-hover:text-white"
        }`}
      >
        {itemDetails.name}
      </p>
    </div>
  );
}
