import "./globals.css";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import ThemeToggle from "@/components/Themetoggle";
import Link from "next/link";
import React from "react";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Tournois LAN",
  description: "Gestion de tournois LAN",
};

export default function RootLayout({
                                     children,
                                   }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html
          lang="fr"
          className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
          suppressHydrationWarning
      >
      <body className="min-h-full flex flex-col bg-bg-main text-text-main transition-colors duration-300">
      <header className="sticky top-0 w-full p-4 border-b border-steel/20 bg-bg-panel/80 backdrop-blur-sm flex items-center justify-between z-40">
          <Link href="/" className="text-2xl font-black tracking-tighter text-blood flex items-center gap-2">
              <span>🎮</span>
              <span className="text-text-main">TURBOLAN<span className="text-blood">MASTERX 4000 </span></span>
          </Link>

          <ThemeToggle />
      </header>

      {/* Le contenu des pages */}
      <main className="grow">
        {children}
      </main>
      </body>
      </html>
  );
}