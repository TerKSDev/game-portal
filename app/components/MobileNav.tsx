"use client";

import { useState } from "react";
import { IoMdMenu } from "react-icons/io";
import { IoGameController } from "react-icons/io5";
import Link from "next/link";
import { PATHS } from "@/app/_config/routes";
import SideNav from "./SideNav";

export default function MobileNav() {
  const [showSideBar, setShowSideBar] = useState(false);

  return (
    <>
      <header className="md:hidden fixed top-0 left-0 right-0 z-40 bg-zinc-900/95 backdrop-blur-md border-b border-zinc-800 p-4 flex items-center justify-between">
        <Link href={PATHS.STORE} className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
            <IoGameController size={20} className="text-white" />
          </div>
          <span className="font-bold text-lg bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Game Portal
          </span>
        </Link>

        <button
          onClick={() => setShowSideBar(true)}
          className="p-2 hover:bg-zinc-800 rounded-lg transition-colors"
        >
          <IoMdMenu size={24} className="text-white" />
        </button>
      </header>

      {showSideBar && (
        <div className="fixed inset-0 z-50 md:hidden">
          <SideNav isMobile onClose={() => setShowSideBar(false)} />
          <div
            className="absolute inset-0 bg-black/50 -z-10"
            onClick={() => setShowSideBar(false)}
          />
        </div>
      )}
    </>
  );
}
