import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import SessionComponent from "@/app/components/SessionProvider";

import "./globals.css";
import Header from "@/app/components/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Game Portal",
  description:
    "A modern game store featuring a virtual points system, secure Touch 'n Go payment integration, and real-time game discovery.",
  openGraph: {
    title: "Game Portal",
    description: "The best place to find your next adventure...",
    siteName: "Game Portal",
    images: ["/og-image.png"],
    type: "website",
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionComponent>
          <Header />

          <main className="w-screen h-full min-h-screen">{children}</main>
        </SessionComponent>
      </body>
    </html>
  );
}
