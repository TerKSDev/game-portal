"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaStar } from "react-icons/fa";
import { PATHS } from "@/app/_config/routes";
import { motion, AnimatePresence } from "framer-motion";

interface FeaturedGame {
  id: number;
  name: string;
  background_image: string | null;
  rating: number;
  genres: {
    id: number;
    name: string;
  }[];
}

interface FeaturedGameCarouselProps {
  games: FeaturedGame[];
}

export default function FeaturedGameCarousel({
  games,
}: FeaturedGameCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (games.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % games.length);
    }, 5000); // 每5秒切换一次

    return () => clearInterval(interval);
  }, [games.length]);

  if (games.length === 0) return null;

  const currentGame = games[currentIndex];

  return (
    <Link
      href={`${PATHS.DETAILS}/${currentGame.id}`}
      className="md:col-span-2 md:row-span-2 bg-zinc-900/50 backdrop-blur-sm rounded-2xl relative overflow-hidden group cursor-pointer border border-zinc-800/80 hover:border-zinc-700/80 transition-all duration-500"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.7, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          {currentGame.background_image && (
            <Image
              src={currentGame.background_image}
              fill
              alt={currentGame.name}
              className="object-cover group-hover:scale-110 group-hover:brightness-75 transition-all duration-700"
              priority
            />
          )}
        </motion.div>
      </AnimatePresence>
      <div className="absolute inset-0 bg-linear-to-t from-black via-black/60 to-transparent" />

      {/* Floating particles effect */}
      <div className="absolute top-4 right-4 flex gap-2 z-10">
        <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
        <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse delay-75"></div>
        <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse delay-150"></div>
      </div>

      {/* Carousel indicators */}
      {games.length > 1 && (
        <div className="absolute top-4 left-4 flex gap-1.5 z-10">
          {games.map((_, index) => (
            <div
              key={index}
              className={`h-1 rounded-full transition-all duration-500 ${
                index === currentIndex
                  ? "w-8 bg-blue-500"
                  : "w-1 bg-zinc-500/50"
              }`}
            />
          ))}
        </div>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={`content-${currentIndex}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="absolute bottom-0 left-0 p-6 w-full"
        >
          <div className="flex items-center gap-2 mb-3">
            <span className="bg-linear-to-r from-blue-500 to-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg shadow-blue-500/50 animate-pulse">
              ⭐ FEATURED
            </span>
            <div className="flex items-center gap-1 bg-amber-500/20 border border-amber-500/30 text-amber-400 px-2.5 py-1 rounded-full">
              <FaStar size={12} />
              <span className="text-xs font-bold">{currentGame.rating}</span>
            </div>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white mb-3 line-clamp-2">
            {currentGame.name}
          </h2>
          <div className="flex gap-2 flex-wrap">
            {currentGame.genres
              .slice(0, 2)
              .map((genre: { id: number; name: string }) => (
                <span
                  key={genre.id}
                  className="text-zinc-200 text-xs bg-zinc-800/90 backdrop-blur-sm px-3 py-1.5 rounded-full border border-zinc-700/50 font-medium"
                >
                  {genre.name}
                </span>
              ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </Link>
  );
}
