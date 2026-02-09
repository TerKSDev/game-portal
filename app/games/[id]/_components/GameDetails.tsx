"use client";

import Image from "next/image";
import { FaStar } from "react-icons/fa";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { IoArrowBack } from "react-icons/io5";

import { GameDetailProps } from "@/lib/game";
import { GetCleanDescription } from "./CleanDescription";
import {
  AddToWishlistButton,
  AddToCartButton,
  PurchasedButton,
} from "./Button";

type newProps = GameDetailProps & {
  wishlistInitialState: boolean;
  cartInitialState: boolean;
  libraryInitialState: boolean;
};

export default function GameDetails({
  game,
  price,
  wishlistInitialState,
  cartInitialState,
  libraryInitialState,
}: newProps) {
  const router = useRouter();
  const cleanedDescription = GetCleanDescription(game.description);

  const gameDetails = {
    gameId: game.id,
    name: game.name,
    price: price ? price.final : "N/A",
    image: game.background_image,
    gameUrl: `https://rawg.io/games/${game.id}`,
  };

  return (
    <div className="flex flex-col flex-1 max-w-7xl gap-6 w-full">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-300 font-bold transition-all py-2 rounded-lg w-fit group"
      >
        <IoArrowBack
          className="group-hover:-translate-x-1 transition-transform"
          size={18}
        />
        Back
      </button>

      <div className="flex flex-row max-lg:flex-col flex-1 gap-6 w-full">
        <div className="flex flex-col flex-3 gap-6 w-full">
          <div className="flex flex-row flex-1 max-lg:flex-col w-full bg-zinc-900/80 backdrop-blur-md border border-zinc-800/80 p-6 rounded-2xl shadow-2xl">
            <div className="flex flex-1 flex-row gap-6 max-lg:flex-col">
              <div className="flex aspect-video relative w-80 max-lg:w-full bg-zinc-800 rounded-xl overflow-hidden shadow-lg">
                <Image
                  src={game.background_image}
                  alt={game.name}
                  fill
                  className="w-full object-cover"
                />
              </div>
              <div className="flex flex-col justify-between w-full gap-4">
                <div className="flex flex-col gap-3">
                  <div className="flex flex-row justify-between items-start w-full gap-4">
                    <h1 className="text-3xl sm:text-3xl font-black text-zinc-200">
                      {game.name}
                    </h1>
                    <div className="flex flex-row items-center bg-linear-to-br from-yellow-500 to-orange-500 text-white font-bold px-3 py-1.5 rounded-lg shadow-md shrink-0">
                      <FaStar className="inline-block mr-1.5" size={14} />
                      <span className="text-sm">{game.rating}</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-y-1.5 text-sm text-zinc-400">
                    <p>Released At: {game.released}</p>
                    <p>Updated At: {game.updated.split("T")[0]}</p>
                  </div>
                </div>
                <div className="flex flex-row gap-2 flex-wrap">
                  {game.genres.map((genre) => (
                    <span
                      key={genre.id}
                      className="bg-zinc-800 border border-zinc-700/80 text-zinc-300 text-xs px-3 py-1.5 rounded-full font-medium"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col w-full bg-zinc-900/80 backdrop-blur-md border border-zinc-800/80 p-6 rounded-2xl shadow-2xl">
            <h2 className="font-bold text-xl mb-4 text-zinc-200">
              About This Game
            </h2>
            <article
              className="w-full p-0.5 py-4 prose prose-zinc max-w-none text-zinc-300 text-sm text-justify"
              dangerouslySetInnerHTML={{ __html: cleanedDescription }}
            ></article>
          </div>

          <div className="flex flex-row max-lg:flex-col gap-6 w-full">
            <div className="flex flex-1">
              <div className="flex flex-col flex-1 bg-zinc-900/80 backdrop-blur-md border border-zinc-800/80 p-5 rounded-2xl shadow-2xl gap-y-4">
                <h2 className="font-bold text-xl text-zinc-200">Publishers</h2>
                <div key={game.id} className="flex flex-wrap gap-4 mt-1">
                  {game.publishers.map((publisher) => (
                    <div
                      key={publisher.id}
                      className="flex flex-1 flex-row gap-x-3 h-fit items-center min-w-50"
                    >
                      <div className="flex items-center border border-zinc-800/80 rounded-lg relative w-20 aspect-video overflow-hidden shadow-md bg-zinc-800">
                        <Image
                          src={publisher.image_background}
                          alt={publisher.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-base text-zinc-300 font-medium">
                          {publisher.name}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex flex-1">
              <div className="flex flex-col w-full bg-zinc-900/80 backdrop-blur-md border border-zinc-800/80 p-5 rounded-2xl shadow-2xl gap-y-4">
                <h2 className="font-bold text-xl text-zinc-200">
                  Related Links
                </h2>
                <div className="flex flex-col gap-y-3 text-sm">
                  <div className="flex flex-row gap-x-2 text-sm">
                    <p className="text-zinc-400">Official Website:</p>
                    <Link
                      key={game.id}
                      href={game.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-zinc-300 hover:text-zinc-200 transition-colors underline"
                    >
                      {game.publishers
                        .map((publisher) => publisher.name)
                        .join(" | ")}
                    </Link>
                  </div>
                  <div className="flex flex-row gap-x-2 text-sm">
                    <p className="text-zinc-400">Metacritic Page:</p>
                    <Link
                      href={game.metacritic_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-zinc-300 hover:text-zinc-200 transition-colors underline"
                    >
                      Metacritic
                    </Link>
                  </div>
                  <div className="flex flex-row gap-x-2 text-sm">
                    <p className="text-zinc-400">Source From:</p>
                    <Link
                      href={"https://rawg.io/games/"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-zinc-300 hover:text-zinc-200 transition-colors underline"
                    >
                      RAWG.io
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-[1.5] bg-zinc-900/80 backdrop-blur-md border border-zinc-800/80 py-6 px-5 rounded-2xl shadow-2xl h-fit flex-col gap-6 max-lg:hidden">
          {price ? (
            <>
              <div className="bg-zinc-800/50 rounded-xl border border-zinc-800/80 flex flex-1 flex-row justify-between w-full px-4 py-3 items-center">
                <h2 className="font-semibold text-lg text-zinc-300">Price</h2>
                <p className="text-xl font-bold text-zinc-200">{price.final}</p>
              </div>
              <div className="bg-zinc-800/50 rounded-xl border border-zinc-800/80 flex flex-row justify-between w-full px-4 py-3 items-center">
                <h2 className="font-semibold text-lg text-zinc-300">
                  Exchange
                </h2>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-linear-to-r from-yellow-400 to-orange-400 shadow-lg shadow-yellow-500/50"></div>
                  <p className="text-xl font-bold bg-linear-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                    {price.final.toLowerCase() === "free"
                      ? "0 Orbs"
                      : `${Number(price.final.replace(/[^\d.]/g, "")) * 100} Orbs`}
                  </p>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-row gap-2 items-center justify-center px-4 py-3 bg-zinc-800/50 rounded-xl border border-zinc-800/80">
              <p className="text-zinc-400">Not Available Now!</p>
            </div>
          )}
          {!libraryInitialState ? (
            <div className=" flex flex-row gap-4 lg:flex-col">
              {price && (
                <AddToCartButton
                  game={gameDetails}
                  initialState={cartInitialState}
                />
              )}
              <AddToWishlistButton
                key={game.id}
                game={gameDetails}
                initialState={wishlistInitialState}
              />
            </div>
          ) : (
            <PurchasedButton key={game.id} />
          )}
        </div>

        <div className="flex-[1.5] bg-zinc-900/80 backdrop-blur-md border border-zinc-800/80 p-5 py-6 rounded-2xl shadow-2xl h-fit flex-col gap-8 max-lg:flex hidden">
          {price ? (
            <>
              <div className="bg-zinc-800/50 rounded-xl border border-zinc-800/80 flex flex-1 flex-row justify-between w-full px-4 py-3 items-center">
                <h2 className="font-semibold text-lg text-zinc-300">Price</h2>
                <p className="text-xl font-bold text-zinc-200">{price.final}</p>
              </div>
              <div className="bg-zinc-800/50 rounded-xl border border-zinc-800/80 flex flex-row justify-between w-full px-4 py-3 items-center">
                <h2 className="font-semibold text-lg text-zinc-300">
                  Exchange
                </h2>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-linear-to-r from-yellow-400 to-orange-400 shadow-lg shadow-yellow-500/50"></div>
                  <p className="text-xl font-bold bg-linear-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                    {price.final.toLowerCase() === "free"
                      ? "0 Orbs"
                      : `${Number(price.final.replace(/[^\d.]/g, "")) * 100} Orbs`}
                  </p>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-row gap-2 items-center justify-between px-4 py-3 bg-zinc-800/50 rounded-xl border border-zinc-800/80">
              <h2 className="font-semibold text-lg text-zinc-300">Price</h2>
              <p className="text-zinc-400">Not Available Now!</p>
            </div>
          )}

          <div className="flex flex-row gap-4 lg:flex-col">
            {!libraryInitialState ? (
              <>
                {price && (
                  <AddToCartButton
                    game={gameDetails}
                    initialState={cartInitialState}
                  />
                )}
                <AddToWishlistButton
                  key={game.id}
                  game={gameDetails}
                  initialState={wishlistInitialState}
                />
              </>
            ) : (
              <PurchasedButton key={game.id} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
