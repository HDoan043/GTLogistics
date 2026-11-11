import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "brand" | "accent" | "gold" | "success" | "warning" | "danger" | "neutral" | "dark";
  className?: string;
}

export function Badge({ children, variant = "brand", className }: BadgeProps) {
  const styles = {
    brand: "bg-blue-50 text-blue-800 border-blue-200/80",
    accent: "bg-gradient-to-r from-amber-500/15 to-yellow-500/15 text-amber-800 border-amber-300/80 font-bold",
    gold: "bg-amber-100/90 text-amber-950 border-amber-300 font-bold",
    success: "bg-emerald-50 text-emerald-800 border-emerald-200/80",
    warning: "bg-amber-50 text-amber-900 border-amber-200/80",
    danger: "bg-rose-50 text-rose-800 border-rose-200/80",
    neutral: "bg-slate-100 text-slate-700 border-slate-200",
    dark: "bg-slate-900 text-amber-300 border-amber-500/30",
  };

  return (
    <span
      className={twMerge(
        clsx(
          "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border tracking-wide",
          styles[variant],
          className
        )
      )}
    >
      {children}
    </span>
  );
}
