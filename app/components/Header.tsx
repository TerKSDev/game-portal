"use client";

import { IoGameController } from "react-icons/io5";
import { IoMdMenu } from "react-icons/io";
import { useState, Suspense } from "react";
import Link from "next/link";

import Navigator from "./Navigator";
import SideBar from "./SideBar";
import SearchBar from "./SearchBar";
import { PATHS } from "@/app/_config/routes";

export default function Header() {
  const [showSideBar, setShowSideBar] = useState(false);

  return (
    <header className="fixed flex flex-row justify-between items-center w-full bg-gray-900/95 backdrop-blur-md border-b border-gray-700/50 p-2 px-3 sm:p-3 sm:px-8 h-20 sm:h-24 max-lg:gap-x-4 lg:gap-x-16 z-50 shadow-2xl shadow-black/50 box-border">
      <div className="flex flex-row gap-x-20 items-center max-md:gap-x-8">
        <button
          onClick={() => setShowSideBar(true)}
          className="hover:bg-gray-700 rounded-lg p-1 md:hidden"
        >
          <IoMdMenu size={26} />
        </button>
        <Link
          href={PATHS.STORE}
          className="flex flex-row font-bold items-end gap-x-3 cursor-pointer max-lg:hidden text-nowrap group"
        >
          <IoGameController
            size={44}
            className="text-blue-500 group-hover:text-blue-400 transition-colors"
          />
          <h1 className="tracking-wider bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent text-2xl mb-0.5 drop-shadow-lg">
            GAME PORTAL
          </h1>
        </Link>

        <Navigator />

        {showSideBar && (
          <div className="fixed top-0 left-0 flex flex-row z-[9999]">
            <SideBar onClose={() => setShowSideBar(false)} />

            <div
              className="bg-black z-20 w-screen h-screen opacity-35"
              onClick={() => setShowSideBar(false)}
            ></div>
          </div>
        )}
      </div>

      <Suspense fallback={<div className="flex flex-1 h-full" />}>
        <SearchBar />
      </Suspense>
    </header>
  );
}
