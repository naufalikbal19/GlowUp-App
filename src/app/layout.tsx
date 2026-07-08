import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NavBar } from "@/components/NavBar";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GlowUp App",
  description: "Panduan personal untuk gym, skincare, bodycare, dan haircare kamu.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-neutral-50 dark:bg-neutral-950">
        <NavBar />
        <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6">{children}</main>
        <footer className="border-t border-black/10 py-4 text-center text-xs text-neutral-400 dark:border-white/10">
          GlowUp App — Rekomendasi bersifat umum, bukan pengganti nasihat medis profesional.
        </footer>
      </body>
    </html>
  );
}
