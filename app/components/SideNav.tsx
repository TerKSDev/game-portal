"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { PATHS } from "@/app/_config/routes";
import {
  IoGameController,
  IoClose,
  IoStorefront,
  IoLibrary,
  IoHeart,
  IoCart,
  IoCalendar,
  IoPeople,
} from "react-icons/io5";

import { useState, useEffect, useCallback } from "react";
import SearchBar from "./SearchBar";
import { Suspense } from "react";
import AvatarPlaceholder from "./AvatarPlaceholder";

interface SideNavProps {
  isMobile?: boolean;
  onClose?: () => void;
}

export default function SideNav({ isMobile = false, onClose }: SideNavProps) {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [userLibraryCount, setUserLibraryCount] = useState(0);
  const [userWishlistCount, setUserWishlistCount] = useState(0);
  const [userCartCount, setUserCartCount] = useState(0);
  const [userBalance, setUserBalance] = useState(0);
  const [mounted, setMounted] = useState(false);

  const fetchStats = useCallback(() => {
    if (session?.user?.id) {
      fetch("/api/user/stats")
        .then((res) => res.json())
        .then((data) => {
          setUserLibraryCount(data.libraryCount || 0);
          setUserWishlistCount(data.wishlistCount || 0);
          setUserCartCount(data.cartCount || 0);
          setUserBalance(data.balance || 0);
        })
        .catch((err) => {
          console.error("Error fetching stats:", err);
        });
    }
  }, [session?.user?.id]);

  // Initial fetch when session changes
  useEffect(() => {
    setMounted(true);
    fetchStats();
  }, [fetchStats]);

  // Set up event listener once
  useEffect(() => {
    const handleRefresh = () => {
      fetchStats();
    };

    window.addEventListener("refreshUserStats", handleRefresh);

    return () => {
      window.removeEventListener("refreshUserStats", handleRefresh);
    };
  }, [fetchStats]);

  const isActive = (path: string) => pathname === path;

  const menuItems = [
    {
      label: "Store",
      path: PATHS.STORE,
      icon: <IoStorefront size={18} />,
      auth: false,
    },
    {
      label: "Library",
      path: PATHS.LIBRARY,
      icon: <IoLibrary size={18} />,
      auth: true,
      badge: userLibraryCount > 0 ? userLibraryCount : undefined,
    },
    {
      label: "Wishlist",
      path: PATHS.WISHLIST,
      icon: <IoHeart size={18} />,
      auth: true,
      badge: userWishlistCount > 0 ? userWishlistCount : undefined,
    },
    {
      label: "Cart",
      path: PATHS.CART,
      icon: <IoCart size={18} />,
      auth: true,
      badge: userCartCount > 0 ? userCartCount : undefined,
    },
  ];

  const socialItems = [
    {
      label: "Events",
      path: PATHS.EVENT,
      icon: <IoCalendar size={18} />,
      auth: false,
    },
    {
      label: "Friends",
      path: PATHS.FRIEND,
      icon: <IoPeople size={18} />,
      auth: true,
    },
  ];

  const showItem = (requireAuth: boolean) => {
    if (!mounted || status === "loading") return false;
    if (requireAuth && status !== "authenticated") return false;
    return true;
  };

  return (
    <aside
      className={`w-72 bg-zinc-900 border-r border-zinc-800 flex flex-col fixed left-0 top-0 h-screen z-50 ${isMobile ? "" : "max-md:hidden"}`}
    >
      {/* Logo */}
      <div className="p-6 flex items-center gap-3 border-b border-zinc-800">
        <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
          <IoGameController size={24} className="text-white" />
        </div>
        <span className="font-bold text-xl tracking-tight bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Game Portal
        </span>
        {isMobile && (
          <button
            onClick={onClose}
            className="ml-auto p-2 hover:bg-zinc-800 rounded-lg transition-colors"
            aria-label="Close menu"
          >
            <IoClose size={24} className="text-zinc-400 hover:text-white" />
          </button>
        )}
      </div>

      {/* Search Bar */}
      <div className="px-4 pt-4">
        <Suspense
          fallback={
            <div className="h-10 bg-zinc-800 rounded-lg animate-pulse" />
          }
        >
          <SearchBar />
        </Suspense>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1 mt-6 overflow-y-auto">
        <div className="text-xs font-bold text-zinc-500 px-3 mb-3">MENU</div>

        {menuItems.map((item) => {
          if (item.auth && !showItem(item.auth)) {
            return null;
          }

          return (
            <Link
              key={item.path}
              href={item.path}
              onClick={isMobile ? onClose : undefined}
              className={`flex items-center gap-5 px-3 py-2.5 rounded-xl transition-all ${
                isActive(item.path)
                  ? "bg-zinc-800 text-white"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
              {item.badge !== undefined && (
                <span className="ml-auto bg-zinc-700 text-xs w-5 h-5 flex items-center justify-center rounded-full text-zinc-300 font-bold">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}

        <div className="text-xs font-bold text-zinc-500 px-3 mt-6 mb-3">
          SOCIAL
        </div>

        {socialItems.map((item) => {
          if (item.auth && !showItem(item.auth)) {
            return null;
          }

          return (
            <Link
              key={item.path}
              href={item.path}
              onClick={isMobile ? onClose : undefined}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                isActive(item.path)
                  ? "bg-zinc-800 text-white"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Info */}
      <div className="p-4 border-t border-zinc-800">
        {mounted && status === "authenticated" && session?.user ? (
          <>
            {/* Balance Card - Top Up Button */}
            <Link
              href={PATHS.TOP_UP}
              onClick={isMobile ? onClose : undefined}
              className="block bg-linear-to-r from-emerald-900/30 to-emerald-800/20 border border-emerald-700/40 rounded-xl p-3 mb-4 hover:from-emerald-900/40 hover:to-emerald-800/30 hover:border-emerald-600/50 transition-all cursor-pointer"
            >
              <div className="text-xs text-emerald-400 font-bold mb-1">
                YOUR BALANCE
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold text-white">
                  {userBalance.toLocaleString()}
                </span>
                <span className="px-3 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 transition-colors text-xs text-black font-bold">
                  Top Up
                </span>
              </div>
            </Link>

            {/* User Profile */}
            <Link
              href={PATHS.PROFILE}
              onClick={isMobile ? onClose : undefined}
              className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-zinc-800/50 transition-colors"
            >
              <div className="w-10 h-10 rounded-full overflow-hidden">
                <AvatarPlaceholder
                  name={session.user.name || "User"}
                  size={40}
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-sm truncate text-white">
                  {session.user.name}
                </div>
                <div className="text-xs text-emerald-400">Online</div>
              </div>
            </Link>
          </>
        ) : (
          <div className="space-y-2">
            <Link
              href={PATHS.LOGIN}
              onClick={isMobile ? onClose : undefined}
              className="block w-full text-center bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-lg transition-colors"
            >
              Login
            </Link>
            <Link
              href={PATHS.REGISTER}
              onClick={isMobile ? onClose : undefined}
              className="block w-full text-center bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold py-2.5 rounded-lg transition-colors"
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </aside>
  );
}
