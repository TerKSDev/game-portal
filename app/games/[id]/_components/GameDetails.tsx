"use client";

import Image from "next/image";
import { FaStar } from "react-icons/fa";
import Link from "next/link";

import { GameDetailProps } from "@/lib/game";
import { GetCleanDescription } from "./CleanDescription";
import { AddToWishlistButton, AddToCartButton, PurchasedButton } from "./Button";

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
  const cleanedDescription = GetCleanDescription(game.description);

  const gameDetails = {
    gameId: game.id,
    name: game.name,
    price: price ? price.final : "N/A",
    image: game.background_image,
    gameUrl: `https://rawg.io/games/${game.id}`,
  };

  return (
    <div className="flex flex-row max-lg:flex-col flex-1 justify-center px-8 mt-21 py-12 font-mono gap-8">
      <div className="flex flex-col flex-3 gap-8 w-full">
        <div className="flex flex-row flex-1 max-lg:flex-col max-w-4xl w-full mx-auto bg-gray-900 p-4 px-5 rounded-md border-2 border-gray-600">
          <div className="flex flex-1 flex-row gap-5 max-lg:flex-col">
            <div className="flex aspect-video relative w-80 max-lg:w-full bg-amber-200">
              <Image
                src={game.background_image}
                alt={game.name}
                fill
                className="w-full rounded border border-gray-400 object-cover"
              />
            </div>
            <div className="flex flex-col justify-between w-full gap-4">
              <div className="flex flex-col gap-2.5">
                <div className="flex flex-row justify-between w-full">
                  <p className="underline underline-offset-8 text-xl font-bold">
                    {game.name}
                  </p>
                  <div className="flex flex-row items-center h-fit">
                    <FaStar className="text-yellow-600 inline-block mr-2" />
                    <div className="inline-block text-yellow-600 font-bold">
                      {game.rating}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-y-1 text-xs text-gray-300">
                  <p>Released At: {game.released}</p>
                  <p>Updated At: {game.updated.split("T")[0]}</p>
                </div>
              </div>
              <div className="flex flex-row gap-2">
                {game.genres.map((genre) => (
                  <p
                    key={genre.id}
                    className="bg-gray-950 text-xs px-3 p-1 rounded-full font-bold border border-gray-400"
                  >
                    {genre.name}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col w-full bg-gray-900 p-6 pb-4 rounded-md border-2 border-gray-600 max-w-4xl mx-auto">
          <h1 className="font-bold text-xl underline underline-offset-8 tracking-wider">
            About This Game
          </h1>
          <article
            className="w-full p-0.5 py-4 prose prose-slate max-w-none text-gray-300 text-sm text-justify"
            dangerouslySetInnerHTML={{ __html: cleanedDescription }}
          ></article>
        </div>

        <div className="flex flex-row max-lg:flex-col gap-4 max-w-4xl w-full mx-auto">
          <div className="flex flex-1">
            <div className="flex flex-col flex-1 bg-gray-900 p-4 pb-5 rounded-md border-2 border-gray-600 gap-y-4">
              <h1 className="font-bold text-xl underline underline-offset-8 tracking-wider">
                Publishers
              </h1>
              <div key={game.id} className="flex flex-wrap gap-2 mt-2">
                {game.publishers.map((publisher) => (
                  <div
                    key={publisher.id}
                    className="flex flex-1 flex-row h-full gap-x-4 items-center"
                  >
                    <div className="flex items-center border border-gray-400 rounded relative w-24 aspect-video">
                      <Image
                        src={publisher.image_background}
                        alt={publisher.name}
                        fill
                        className="rounded"
                      />
                    </div>
                    <div>
                      <p className="text-lg text-gray-300">{publisher.name}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex flex-1">
            <div className="flex flex-col w-full bg-gray-900 p-4 pb-5 rounded-md border-2 border-gray-600 mx-auto gap-y-4">
              <h1 className="font-bold text-xl underline underline-offset-8 tracking-wider">
                Related Links
              </h1>
              <div className="flex flex-col gap-y-1.5 text-sm">
                <div className="flex flex-row gap-x-2 text-xs">
                  <p>Official Website:</p>
                  <Link
                    key={game.id}
                    href={game.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 underline underline-offset-4"
                  >
                    {game.publishers.map((publisher) => publisher.name)}
                  </Link>
                </div>
                <div className="flex flex-row gap-x-2 text-xs">
                  <p>Metacritic Page:</p>
                  <Link
                    href={game.metacritic_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 underline underline-offset-4"
                  >
                    Metacritic
                  </Link>
                </div>
                <div className="flex flex-row gap-x-2 text-xs">
                  <p>Source From:</p>
                  <Link
                    href={"https://rawg.io/games/"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 underline underline-offset-4"
                  >
                    RAWG.io
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-[1.5] bg-gray-900 py-6 px-4 rounded-md border-2 border-gray-600 h-fit flex-col gap-8  max-lg:hidden">
        {price ? (
          <div className="bg-gray-950 rounded border-2 border-gray-700 flex flex-1 flex-row justify-between w-full px-4 py-1 items-center">
            <h2 className="font-bold text-lg">Price</h2>
            <p>{price.final}</p>
          </div>
        ) : (
          <div className="flex flex-row gap-2 items-center justify-center px-2 py-1 bg-gray-950 rounded border-2 border-gray-700">
            <p>Not Available Now !</p>
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

      <div className="flex-[1.5] bg-gray-900 p-4 py-8 rounded-md border-2 border-gray-600 h-fit flex-col gap-6 max-lg:flex hidden">
        {price ? (
          <div className="bg-gray-950 rounded border-2 border-gray-700 flex flex-1 flex-row justify-between w-full px-4 py-1 items-center">
            <h2 className="font-bold text-lg">Price</h2>
            <p>{price.final}</p>
          </div>
        ) : (
          <div className="flex flex-row gap-2 items-center justify-between px-2 py-1 bg-gray-950 rounded border-2 border-gray-700">
            <h2 className="font-bold text-lg">Price</h2>
            <p>Not Available Now !</p>
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
  );
}
