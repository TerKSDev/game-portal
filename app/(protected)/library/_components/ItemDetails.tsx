"use client";
import Image from "next/image";
import { LibraryProps } from "../page";

export default function itemDetails({
  itemDetails,
}: {
  itemDetails: LibraryProps;
}) {
  return (
    <div className="flex flex-col w-full flex-1">
      <div className="relative flex w-full h-full">
        <Image
          src={itemDetails.image}
          alt={itemDetails.name}
          fill
          className="object-cover opacity-70"
        />
      </div>
      <div className="flex flex-row bg-gray-900 p-3.5 px-12 items-center gap-8">
        <button className="bg-green-700 p-1 px-12 rounded-sm">Play</button>
        <p className="text-wrap text-sm">{itemDetails.name}</p>
      </div>
    </div>
  );
}
