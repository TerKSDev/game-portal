"use client";
import Image from "next/image";
import { LibraryProps } from "../page";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function ItemDetails({
  itemDetails,
}: {
  itemDetails: LibraryProps;
}) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(false);
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 10);
    return () => clearTimeout(timer);
  }, [itemDetails.id]);

  return (
    <div
      className={`flex flex-col w-full flex-1 transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-50"
      }`}
    >
      <div className="relative flex w-full h-full min-h-125">
        <Image
          src={itemDetails.image}
          alt={itemDetails.name}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black via-black/50 to-transparent"></div>

        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 lg:p-8">
          <div className="max-w-4xl">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              {itemDetails.name}
            </h1>
            <div className="flex flex-wrap gap-3 sm:gap-4 text-xs sm:text-sm text-gray-300 mb-4 sm:mb-6">
              <div className="flex flex-col">
                <span className="text-gray-500 text-xs">Purchased Date</span>
                <span className="font-medium">{itemDetails.purchasedAt}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-gray-500 text-xs">Purchase Price</span>
                <span className="font-medium text-blue-400">
                  {itemDetails.purchasedPrice.replace("+", "|")}
                </span>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Link
                href={itemDetails.gameUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-linear-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-green-500/50 text-center text-sm sm:text-base"
              >
                Play Now
              </Link>
              <Link
                href={`/games/${itemDetails.gameId}`}
                className="bg-gray-800/80 backdrop-blur-sm border border-gray-700 hover:bg-gray-700 hover:border-gray-600 px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg font-semibold transition-all duration-300 text-center text-sm sm:text-base"
              >
                View Details
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
