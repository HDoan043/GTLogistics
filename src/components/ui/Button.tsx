import React from "react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "accent" | "gold" | "outline" | "ghost" | "danger" | "gradient";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export function Button({
  className,
  variant = "primary",
  size = "md",
  isLoading = false,
  children,
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center font-semibold transition-colors duration-150 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.99] motion-safe:transition-transform";

  const variants = {
    // Primary: Xanh Azure hoàng gia của chữ GT
    primary:
      "bg-azure-600 hover:bg-azure-700 text-white focus-visible:ring-azure-500 shadow-sm",
    
    // Accent: Vàng Hoàng Kim 3D đẳng cấp chuẩn Logo GT
    accent:
      "bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-slate-950 font-bold focus-visible:ring-gold-400 shadow-md shadow-gold-500/20 border border-gold-300/40",
    
    // Gold: Vàng Kim đồng nhất
    gold:
      "bg-gold-500 hover:bg-gold-400 text-slate-950 font-bold focus-visible:ring-gold-400 shadow-sm",

    gradient:
      "bg-gradient-to-r from-azure-600 to-brand-700 hover:from-azure-500 hover:to-brand-600 text-white shadow-sm",
    
    outline:
      "border border-slate-300 bg-white text-slate-800 hover:bg-slate-50 hover:border-slate-400 focus-visible:ring-azure-500 shadow-sm",
    
    ghost: "text-slate-700 hover:bg-slate-100 focus-visible:ring-slate-400",
    danger: "bg-red-600 hover:bg-red-700 text-white focus-visible:ring-red-400 shadow-sm",
  };

  const sizes = {
    sm: "text-xs px-3 py-1.5 gap-1.5",
    md: "text-sm px-4 py-2.5 gap-2",
    lg: "text-base px-6 py-3.5 gap-2.5",
  };

  return (
    <button
      className={twMerge(clsx(baseStyles, variants[variant], sizes[size], className))}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg
          aria-hidden="true"
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
    </button>
  );
}
