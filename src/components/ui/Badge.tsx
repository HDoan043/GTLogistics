import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "brand" | "accent" | "success" | "warning" | "danger" | "neutral" | "dark";
  className?: string;
}

export function Badge({ children, variant = "brand", className }: BadgeProps) {
  const styles = {
    brand: "bg-blue-50 text-blue-800 border-blue-200/80",
    accent: "bg-sky-50 text-sky-800 border-sky-200/80",
    success: "bg-emerald-50 text-emerald-800 border-emerald-200/80",
    warning: "bg-amber-50 text-amber-900 border-amber-200/80",
    danger: "bg-rose-50 text-rose-800 border-rose-200/80",
    neutral: "bg-slate-100 text-slate-700 border-slate-200",
    dark: "bg-slate-900 text-sky-300 border-slate-700/80",
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
