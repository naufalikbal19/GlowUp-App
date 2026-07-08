"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Dumbbell, Sparkles, Droplet, Scissors, User } from "lucide-react";
import clsx from "clsx";

const NAV_ITEMS = [
  { href: "/gym", label: "Gym", icon: Dumbbell, color: "text-blue-600" },
  { href: "/skincare", label: "Skincare", icon: Sparkles, color: "text-pink-600" },
  { href: "/bodycare", label: "Bodycare", icon: Droplet, color: "text-purple-600" },
  { href: "/haircare", label: "Haircare", icon: Scissors, color: "text-amber-600" },
];

export function NavBar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-black/10 bg-white/80 backdrop-blur dark:border-white/10 dark:bg-neutral-950/80">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <span className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-clip-text text-lg text-transparent">
            GlowUp
          </span>
        </Link>
        <nav className="flex flex-1 items-center gap-1 overflow-x-auto">
          {NAV_ITEMS.map(({ href, label, icon: Icon, color }) => {
            const active = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={clsx(
                  "flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition",
                  active
                    ? "bg-black/5 dark:bg-white/10"
                    : "text-neutral-500 hover:bg-black/5 dark:text-neutral-400 dark:hover:bg-white/10"
                )}
              >
                <Icon size={16} className={active ? color : undefined} />
                {label}
              </Link>
            );
          })}
        </nav>
        <Link
          href="/profile"
          className={clsx(
            "flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition",
            pathname.startsWith("/profile")
              ? "bg-black/5 dark:bg-white/10"
              : "text-neutral-500 hover:bg-black/5 dark:text-neutral-400 dark:hover:bg-white/10"
          )}
        >
          <User size={16} />
          Profil
        </Link>
      </div>
    </header>
  );
}
