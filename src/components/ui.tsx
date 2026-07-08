import clsx from "clsx";
import Link from "next/link";
import type { ReactNode } from "react";

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={clsx(
        "rounded-2xl border border-black/10 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-neutral-900",
        className
      )}
    >
      {children}
    </div>
  );
}

export function Stat({ label, value, hint }: { label: string; value: ReactNode; hint?: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs font-medium uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
        {label}
      </span>
      <span className="text-xl font-semibold">{value}</span>
      {hint && <span className="text-xs text-neutral-500 dark:text-neutral-400">{hint}</span>}
    </div>
  );
}

export function Badge({ children, tone = "neutral" }: { children: ReactNode; tone?: "neutral" | "pink" | "blue" | "purple" | "amber" | "green" }) {
  const tones: Record<string, string> = {
    neutral: "bg-black/5 text-neutral-700 dark:bg-white/10 dark:text-neutral-300",
    pink: "bg-pink-500/10 text-pink-600 dark:text-pink-400",
    blue: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
    purple: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
    amber: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    green: "bg-green-500/10 text-green-600 dark:text-green-400",
  };
  return (
    <span className={clsx("inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium", tones[tone])}>
      {children}
    </span>
  );
}

export function Button({
  children,
  variant = "primary",
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" }) {
  return (
    <button
      className={clsx(
        "inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-50",
        variant === "primary"
          ? "bg-neutral-900 text-white hover:bg-neutral-700 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
          : "border border-black/10 bg-white text-neutral-900 hover:bg-black/5 dark:border-white/10 dark:bg-neutral-900 dark:text-white dark:hover:bg-white/10",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function LinkButton({
  href,
  children,
  variant = "primary",
  className,
}: {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={clsx(
        "inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition",
        variant === "primary"
          ? "bg-neutral-900 text-white hover:bg-neutral-700 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200"
          : "border border-black/10 bg-white text-neutral-900 hover:bg-black/5 dark:border-white/10 dark:bg-neutral-900 dark:text-white dark:hover:bg-white/10",
        className
      )}
    >
      {children}
    </Link>
  );
}

export function EmptyState({ title, description, action }: { title: string; description: string; action?: ReactNode }) {
  return (
    <Card className="flex flex-col items-center gap-3 py-10 text-center">
      <h3 className="text-base font-semibold">{title}</h3>
      <p className="max-w-sm text-sm text-neutral-500 dark:text-neutral-400">{description}</p>
      {action}
    </Card>
  );
}
