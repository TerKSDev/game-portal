"use client";

import { usePathname } from "next/navigation";
import { ROUTES } from "@/app/_config/routes";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function Navigator() {
  const { data: session, status } = useSession();
  const path = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const visibleRoutes = [
    "Store",
    "Login",
    "Register",
    "Profile",
    "Library",
    "Wishlist",
    "Cart",
    "Friend",
  ];
  const guestRoutes = ["Login", "Register"];
  const authRoutes = ["Profile", "Library"];
  const subRoutes = ["Profile", "Wishlist", "Cart", "Friend"];

  return (
    <nav
      className="flex flex-row gap-x-8 max-md:hidden"
      suppressHydrationWarning
    >
      {!mounted || status === "loading" ? (
        <Link
          href="/store"
          className="text-base font-medium transition-all relative group/link text-gray-300 hover:text-blue-300"
        >
          Store
        </Link>
      ) : (
        ROUTES.filter((route) => visibleRoutes.includes(route.name)).map(
          (route) => {
            const isActive = path === route.path;
            let showNavigate = false;

            if (status === "authenticated") {
              showNavigate = authRoutes.includes(route.name);

              if (!guestRoutes.includes(route.name)) {
                showNavigate = true;
              }
            } else {
              if (!authRoutes.includes(route.name)) {
                showNavigate = true;
              }
            }

            if (
              !showNavigate ||
              (subRoutes.includes(route.name) && route.name !== "Profile")
            ) {
              return null;
            }

            if (route.name === "Profile") {
              return (
                <div key={route.name} className="group relative">
                  <Link
                    href={route.path}
                    className={`text-base font-medium transition-all py-2 ${
                      isActive
                        ? "text-blue-400"
                        : "hover:text-blue-300 text-gray-300"
                    } `}
                  >
                    {session?.user?.name}
                  </Link>

                  <div
                    className={`hidden flex-col absolute top-full -left-1 mt-1 group-hover:flex rounded-lg border border-gray-700 bg-gray-900/95 backdrop-blur-md shadow-xl overflow-hidden text-sm text-nowrap z-50`}
                  >
                    {ROUTES.map((subroute) => {
                      if (subRoutes.includes(subroute.name)) {
                        return (
                          <Link
                            href={subroute.path}
                            key={subroute.name}
                            className="px-6 py-3 flex-1 hover:bg-blue-600/20 hover:text-blue-300 transition-colors"
                          >
                            My {subroute.name}
                          </Link>
                        );
                      }
                    })}
                  </div>
                </div>
              );
            }
            return (
              <Link
                key={route.name}
                href={route.path}
                className={`text-base font-medium transition-all relative group/link ${
                  isActive
                    ? "text-blue-400"
                    : "hover:text-blue-300 text-gray-300"
                }`}
              >
                {route.name}
                <span
                  className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transition-all group-hover/link:w-full ${isActive ? "w-full" : ""}`}
                ></span>
              </Link>
            );
          },
        )
      )}
    </nav>
  );
}
