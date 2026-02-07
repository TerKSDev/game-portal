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
    <div className="flex flex-row items-center gap-3 p-3 text-sm min-w-full group">
      <div className="relative w-20 h-12 shrink-0 rounded-lg overflow-hidden shadow-lg border border-zinc-700/50 group-hover:border-zinc-600 transition-all">
        <Image
          src={itemDetails.image}
          alt={itemDetails.name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-300"
        />
      </div>
      <div className="flex-1 min-w-0">
        <p
          className={`line-clamp-2 transition-colors font-medium ${
            isSelected
              ? "text-blue-300"
              : "text-zinc-300 group-hover:text-white"
          }`}
        >
          {itemDetails.name}
        </p>
        {isSelected && (
          <p className="text-xs text-blue-500/70 mt-1 font-medium">
            Now viewing
          </p>
        )}
      </div>
      {isSelected && (
        <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse shrink-0"></div>
      )}
    </div>
  );
}
