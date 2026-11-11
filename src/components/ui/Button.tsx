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
    "inline-flex items-center justify-center font-semibold transition-all duration-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.98]";

  const variants = {
    // Primary: Xanh Azure hoàng gia của chữ GT
    primary:
      "bg-blue-700 hover:bg-blue-800 text-white focus:ring-blue-500 shadow-md shadow-blue-700/20",
    
    // Accent: Gradient Vàng Hoàng Kim 3D đẳng cấp chuẩn Logo GT
    accent:
      "bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:via-yellow-300 hover:to-amber-400 text-slate-950 font-bold focus:ring-amber-400 shadow-lg shadow-amber-500/25 border border-amber-300/50",
    
    // Gold: Vàng Kim đồng nhất
    gold:
      "bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold focus:ring-amber-400 shadow-md shadow-amber-500/20",

    gradient:
      "bg-gradient-to-r from-blue-700 via-sky-600 to-blue-800 hover:from-blue-600 hover:to-sky-500 text-white shadow-md",
    
    outline:
      "border border-slate-300 bg-white text-slate-800 hover:bg-slate-50 hover:border-slate-400 focus:ring-blue-500 shadow-sm",
    
    ghost: "text-slate-700 hover:bg-slate-100 focus:ring-slate-400",
    danger: "bg-red-600 hover:bg-red-700 text-white focus:ring-red-400 shadow-sm",
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
