'use client'

import { usePathname } from "next/navigation";
import { ROUTES } from "@/app/_config/routes";
import Link from "next/link";
import { useSession } from "next-auth/react"

export default function Navigator() {
    const { data: session, status } = useSession();
    const path = usePathname();

    console.log(status);

    const visibleRoutes = [
      "Store",
      "Login",
      "Register",
      "Profile",
      "Library",
      "Wishlist",
      "Cart",
    ];
    const guestRoutes = [ 'Login', 'Register' ]
    const authRoutes = [ 'Profile', 'Library' ]
    const subRoutes = [ 'Profile', 'Wishlist', 'Cart' ]

    return (
        <nav className="flex flex-row gap-x-8 font-mono max-md:hidden">
            { ROUTES.filter(route => visibleRoutes.includes(route.name)).
            map(route => {
                const isActive = path === route.path;
                let showNavigate = false;

                if (status === 'loading') {
                    showNavigate = route.name === 'Store';
                } else if (status === 'authenticated') {
                    showNavigate = authRoutes.includes(route.name);

                    if (!guestRoutes.includes(route.name)) {
                        showNavigate = true;
                    }
                }
                else {
                    if (!authRoutes.includes(route.name)) {
                        showNavigate = true;
                    }
                }

                if (!showNavigate || (subRoutes.includes(route.name) && route.name !== 'Profile')) {
                    return null;
                }

                if (route.name === 'Profile') {
                    return (
                        <div key={ route.name } className="group relative">
                            <Link
                                href={ route.path }
                                className={ `text-lg transition-all ${isActive
                                    ? 'text-sky-400 underline underline-offset-8'
                                    : 'hover:text-gray-200  text-gray-300'
                                    } ` }
                            >
                                { session?.user?.name }
                            </Link>

                            <div className={ `hidden flex-col absolute top-full -left-1 group-hover:flex rounded border-2 border-gray-600 text-sm text-nowrap` }>
                                { ROUTES.map(subroute => {
                                    if (subRoutes.includes(subroute.name)) {
                                        return (
                                            <Link
                                                href={ subroute.path }
                                                key={ subroute.name } className="bg-gray-950 px-8 py-2.5 flex-1 hover:bg-gray-800"
                                            >
                                                My { subroute.name }
                                            </Link>

                                        );
                                    }
                                }) }
                            </div>
                        </div>
                    );
                }
                return (
                    <Link
                        key={ route.name }
                        href={ route.path }
                        className={ `text-lg transition-all ${isActive
                            ? 'text-sky-400 underline underline-offset-8'
                            : 'hover:text-gray-200 hover:underline-offset-8 hover:underline text-gray-300'
                            }` }
                    >
                        { route.name }
                    </Link>
                )
            }) }
        </nav>
    );
}