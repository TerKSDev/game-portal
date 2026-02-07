"use client";
import Image from "next/image";
import { LibraryProps } from "../page";
import Link from "next/link";
import { useState, useEffect } from "react";
import { FaPlay, FaInfoCircle, FaCalendar, FaTag } from "react-icons/fa";

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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div
      className={`flex flex-col w-full h-full bg-zinc-900/50 backdrop-blur-md border border-zinc-800/80 rounded-2xl overflow-hidden transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-50"
      }`}
    >
      {/* Hero Image */}
      <div className="relative w-full h-64 sm:h-80 lg:flex-1 lg:max-h-[50%]">
        <Image
          src={itemDetails.image}
          alt={itemDetails.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-t from-zinc-900 via-zinc-900/60 to-transparent"></div>

        {/* Floating Badge */}
        <div className="absolute top-4 right-4 bg-emerald-500/90 backdrop-blur-sm text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg flex items-center gap-2">
          <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
          OWNED
        </div>
      </div>

      {/* Content */}
      <div className="p-6 sm:p-8 flex-1 overflow-y-auto">
        <h1 className="text-3xl sm:text-4xl font-black mb-4 bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          {itemDetails.name}
        </h1>

        {/* Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-xl p-4">
            <div className="flex items-center gap-2 text-zinc-500 text-xs font-bold mb-2">
              <FaCalendar size={12} />
              PURCHASED DATE
            </div>
            <div className="text-zinc-200 font-medium">
              {formatDate(itemDetails.purchasedAt)}
            </div>
          </div>

          <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-xl p-4">
            <div className="flex items-center gap-2 text-zinc-500 text-xs font-bold mb-2">
              <FaTag size={12} />
              PURCHASE PRICE
            </div>
            <div className="text-blue-400 font-bold text-lg">
              {itemDetails.purchasedPrice.replace("+", "|")}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href={itemDetails.gameUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-linear-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 px-6 py-3.5 rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-emerald-500/50 text-center flex items-center justify-center gap-2 group"
          >
            <FaPlay
              size={14}
              className="group-hover:scale-110 transition-transform"
            />
            Play Now
          </Link>
          <Link
            href={`/games/${itemDetails.gameId}`}
            className="flex-1 bg-zinc-800/80 border border-zinc-700 hover:bg-zinc-700 hover:border-zinc-600 px-6 py-3.5 rounded-xl font-bold transition-all duration-300 text-center flex items-center justify-center gap-2 group"
          >
            <FaInfoCircle
              size={14}
              className="group-hover:scale-110 transition-transform"
            />
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
