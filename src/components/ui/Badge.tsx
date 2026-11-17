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
    brand: "bg-azure-50 text-azure-900 border-azure-200/80",
    accent: "bg-gold-50 text-gold-900 border-gold-300 font-semibold",
    gold: "bg-gold-100/90 text-gold-950 border-gold-300 font-semibold",
    success: "bg-emerald-50 text-emerald-800 border-emerald-200/80",
    warning: "bg-amber-50 text-amber-900 border-amber-200/80",
    danger: "bg-rose-50 text-rose-800 border-rose-200/80",
    neutral: "bg-slate-100 text-slate-700 border-slate-200",
    dark: "bg-slate-900 text-gold-400 border-gold-500/30",
  };

  return (
    <span
      className={twMerge(
        clsx(
          "inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border",
          styles[variant],
          className
        )
      )}
    >
      {children}
    </span>
  );
}
