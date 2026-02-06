"use client";

import { usePathname } from "next/navigation";
import { ROUTES } from "@/app/_config/routes";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  IoStorefront,
  IoLibrary,
  IoPerson,
  IoHeart,
  IoCart,
  IoLogIn,
  IoPersonAdd,
  IoLogOut,
  IoClose,
  IoCalendar,
} from "react-icons/io5";
import { FaUserFriends } from "react-icons/fa";
import { PATHS } from "@/app/_config/routes";

const routeIcons: Record<string, any> = {
  Store: IoStorefront,
  Library: IoLibrary,
  Profile: IoPerson,
  Wishlist: IoHeart,
  Cart: IoCart,
  Login: IoLogIn,
  Register: IoPersonAdd,
  Friend: FaUserFriends,
  Event: IoCalendar,
};

interface SideBarProps {
  onClose?: () => void;
}

export default function SideBar({ onClose }: SideBarProps) {
  const { data: session, status } = useSession();
  const path = usePathname();
  const username = session?.user?.name;
  const router = useRouter();

  const guestRoutes = ["Login", "Register"];
  const authRoutes = ["Profile", "Library", "Wishlist", "Cart", "Friend"];

  // Routes that should never appear in sidebar
  const hiddenRoutes = [
    "Details",
    "Checkout",
    "Payment Success",
    "Top Up",
    "History",
  ];

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push(PATHS.LOGIN);
    onClose?.();
  };

  return (
    <nav className="fixed flex flex-col z-9999 left-0 top-0 bg-gray-900/98 backdrop-blur-md h-screen w-72 shadow-2xl border-r border-gray-700/50 animate-in slide-in-from-left duration-300">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-700/50">
        <div className="flex flex-col">
          <h2 className="text-xl font-bold bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Menu
          </h2>
          {status === "authenticated" && username && (
            <p className="text-sm text-gray-400 mt-1">
              Welcome, <span className="text-blue-400">{username}</span>
            </p>
          )}
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          aria-label="Close menu"
        >
          <IoClose size={24} className="text-gray-400 hover:text-white" />
        </button>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto py-4">
        {ROUTES.map((route) => {
          // Skip routes that should not be in sidebar
          if (hiddenRoutes.includes(route.name)) return null;

          const isActive = path === route.path;
          const Icon = routeIcons[route.name];

          let showNavigate = false;

          if (status === "loading") {
            showNavigate = route.name === "Store";
          } else if (status === "authenticated") {
            showNavigate = authRoutes.includes(route.name);

            if (!guestRoutes.includes(route.name)) {
              showNavigate = true;
            }
          } else {
            if (!authRoutes.includes(route.name)) {
              showNavigate = true;
            }
          }

          if (!showNavigate) return null;

          return (
            <Link
              key={route.path}
              href={route.path}
              onClick={onClose}
              className={`flex items-center gap-4 mx-3 mb-1 p-3.5 px-4 rounded-lg text-start transition-all duration-200 group ${
                isActive
                  ? "bg-blue-600/20 text-blue-400 border-l-4 border-blue-500 pl-3"
                  : "text-gray-300 hover:bg-gray-800/50 hover:text-white border-l-4 border-transparent"
              }`}
            >
              {Icon && (
                <Icon
                  size={22}
                  className={`${
                    isActive
                      ? "text-blue-400"
                      : "text-gray-400 group-hover:text-white"
                  } transition-colors`}
                />
              )}
              <span className="font-medium">
                {route.name === "Profile" ? username : route.name}
              </span>
              {isActive && (
                <div className="ml-auto w-2 h-2 rounded-full bg-blue-500"></div>
              )}
            </Link>
          );
        })}
      </div>

      {/* Footer - Logout Button */}
      {status === "authenticated" && (
        <div className="p-4 border-t border-gray-700/50">
          <button
            onClick={handleSignOut}
            className="flex items-center gap-4 w-full p-3.5 px-4 rounded-lg text-gray-300 hover:bg-red-600/20 hover:text-red-400 transition-all duration-200 group"
          >
            <IoLogOut
              size={22}
              className="text-gray-400 group-hover:text-red-400 transition-colors"
            />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      )}
    </nav>
  );
}
