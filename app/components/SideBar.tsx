'use client'

import { usePathname } from "next/navigation";
import { ROUTES } from "@/app/_config/routes";
import Link from "next/link";
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

export default function SideBar() {
    const { data: session, status } = useSession();
    const path = usePathname();
    const username = session?.user?.name;
    const router = useRouter();

    const guestRoutes = [ 'Login', 'Register' ]
    const authRoutes = [ 'Profile', 'Library', 'Wishlist', 'Cart' ]

    return (
        <nav className="flex flex-col z-30 left-0 top-0 bg-black py-8 border-r-2 border-gray-700 w-52">
            { ROUTES.map(route => {
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

                if (!showNavigate) return null;

                return (
                    <Link href={ route.path } className={ `w-full p-3 px-4 text-start hover:bg-gray-800 ${isActive ? 'bg-gray-800' : ''}` }>{ route.name === 'Profile' ? username : route.name }</Link>
                )
            }) }
        </nav>
    );
}