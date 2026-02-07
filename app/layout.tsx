import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import SessionComponent from "@/app/components/SessionProvider";

import "./globals.css";
import SideNav from "@/app/components/SideNav";
import MobileNav from "@/app/components/MobileNav";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Game Portal - Your Ultimate Gaming Marketplace",
    template: "%s | Game Portal",
  },
  description:
    "Discover and purchase the latest games at Game Portal. Features virtual points system, secure payment integration, wishlist, library management, and instant game delivery.",
  keywords: [
    "game store",
    "buy games",
    "gaming marketplace",
    "game portal",
    "digital games",
    "game library",
    "wishlist",
    "game deals",
  ],
  authors: [{ name: "TerKSDev", url: "https://github.com/TerkSDev" }],
  creator: "TerKSDev",
  publisher: "TerKSDev",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://gamestore.quadrawebs.com"),
  openGraph: {
    title: "Game Portal - Your Ultimate Gaming Marketplace",
    description:
      "Discover thousands of games. Build your library. Start your adventure.",
    siteName: "Game Portal",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Game Portal - Your Gaming Marketplace",
      },
      {
        url: "/og-image-square.png",
        width: 1200,
        height: 1200,
        alt: "Game Portal - Your Gaming Marketplace",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Game Portal - Your Ultimate Gaming Marketplace",
    description:
      "Discover thousands of games. Build your library. Start your adventure.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex`}
      >
        <SessionComponent>
          <SideNav />
          <MobileNav />

          <main className="flex-1 md:ml-72 w-full min-h-screen overflow-y-auto pt-16 md:pt-0">
            {children}
          </main>
        </SessionComponent>
      </body>
    </html>
  );
}
