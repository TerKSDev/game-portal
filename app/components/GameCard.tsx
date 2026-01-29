"use client";

import Image from "next/image";
import Link from "next/link";
import { FaStar } from "react-icons/fa";

import { GameProps } from "@/lib/game";
import { PATHS } from "@/app/_config/routes";

interface GameCardProps {
  game: GameProps;
}

export default function GameCard({ game }: GameCardProps) {
  return (
    <Link
      href={`${PATHS.DETAILS}/${game.id} `}
      className="relative flex flex-col group bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-700/50 hover:border-blue-500/50 box-border w-full h-full cursor-pointer transition-all duration-300 hover:transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/20"
    >
      <div className="relative flex w-full overflow-hidden rounded-t-xl object-cover aspect-video bg-gray-800">
        {game.background_image ? (
          <Image
            src={game.background_image}
            fill
            alt={game.name}
            className="object-cover transition-transform duration-300 group-hover:scale-110"
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full text-gray-500">
            Image Not Found
          </div>
        )}
      </div>

      <div className="flex flex-row justify-between items-start flex-1 box-border w-full">
        <div className="flex flex-col justify-between gap-y-4 text-sm p-5 flex-1 h-full">
          <div className="flex flex-row justify-between items-start">
            <div className="flex flex-col h-full gap-y-2">
              <p className="font-semibold text-base group-hover:text-blue-400 transition-colors line-clamp-2 pr-1.5">
                {game.name}
              </p>
              <div className="flex flex-col gap-y-0.5">
                <div className="text-xs flex flex-row gap-x-1.5 text-gray-400">
                  <p className="text-gray-500">Release:</p>
                  <p className="text-gray-300">{game.released}</p>
                </div>
                <div className="text-xs flex flex-row gap-x-1.5 text-gray-400">
                  <p className="text-gray-500">Metacritic:</p>
                  <div className="flex flex-row gap-x-1 items-center text-amber-400">
                    <FaStar size={10} />
                    <p className="font-semibold">{game.metacritic}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-row items-center justify-center text-sm gap-x-1.5 bg-linear-to-br from-yellow-500 to-orange-500 text-white font-bold h-fit px-2.5 py-1 rounded-lg shadow-md">
              <FaStar size={12} />
              <p>{game.rating}</p>
            </div>
          </div>
          <div className="flex flex-row gap-2 flex-wrap w-full">
            {game.genres.map((genre) => {
              return (
                <div
                  key={genre.id}
                  className="text-xs bg-linear-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 text-blue-300 px-3 py-1 rounded-full font-medium hover:from-blue-600/30 hover:to-purple-600/30 transition-all"
                >
                  {genre.name}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Link>
  );
}
