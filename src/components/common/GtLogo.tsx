import React from "react";
import Image from "next/image";

interface GtLogoProps {
  className?: string;
  variant?: "light" | "dark" | "full" | "iconOnly";
  showSlogan?: boolean;
}

export function GtLogo({
  className = "",
  variant = "light",
  showSlogan = false,
}: GtLogoProps) {
  const isDark = variant === "dark";

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      {/* Dynamic Emblem SVG matching the official 3D illuminated wall */}
      <div className="relative shrink-0 flex items-center justify-center">
        <svg
          viewBox="0 0 140 100"
          className="w-11 h-8 sm:w-12 sm:h-9"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Curved Expressway Roadway (Highway Arc on the left) */}
          <path
            d="M 15 90 C 15 45, 38 18, 90 12 L 80 26 C 45 30, 32 48, 30 90 Z"
            fill="#525F7F"
          />
          {/* Dashed Center Road Stripe */}
          <path
            d="M 23 85 C 23 58, 36 34, 76 20"
            stroke="#FFFFFF"
            strokeWidth="3.5"
            strokeDasharray="6 6"
            strokeLinecap="round"
          />

          {/* Letter G - Modern dynamic blue curve */}
          <path
            d="M 38 88 C 36 55, 48 34, 76 34 C 88 34, 94 38, 98 44 L 84 54 C 82 50, 78 48, 73 48 C 58 48, 52 60, 52 75 C 52 82, 57 88, 66 88 C 72 88, 77 85, 80 81 L 80 72 L 67 72 L 67 60 L 96 60 L 96 84 C 89 91, 78 96, 65 96 C 47 96, 38 90, 38 88 Z"
            fill="#1D4ED8"
          />

          {/* Letter T - Dynamic bold forward-slanting top stroke */}
          <path
            d="M 72 22 L 132 10 L 126 26 L 102 26 L 102 88 L 86 88 L 86 24 L 72 24 Z"
            fill="#1E40AF"
          />
        </svg>
      </div>

      {/* Brand Typography */}
      {variant !== "iconOnly" && (
        <div className="flex flex-col">
          <div className="flex items-baseline gap-1.5 leading-none">
            <span
              className={`font-black text-xl sm:text-2xl tracking-tighter ${
                isDark ? "text-white" : "text-slate-900"
              }`}
            >
              GT
            </span>
            <span
              className={`font-extrabold text-xs sm:text-sm tracking-[0.25em] uppercase ${
                isDark ? "text-sky-400" : "text-blue-700"
              }`}
            >
              LOGISTICS
            </span>
          </div>

          {showSlogan ? (
            <span
              className={`text-[9px] sm:text-[10px] uppercase font-bold tracking-wider mt-1 ${
                isDark ? "text-slate-400" : "text-slate-500"
              }`}
            >
              Đồng hành tin cậy - Phát triển bền vững
            </span>
          ) : (
            <span
              className={`text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider mt-0.5 ${
                isDark ? "text-slate-400" : "text-slate-500"
              }`}
            >
              Tiếp Vận & Xuất Nhập Khẩu Móng Cái
            </span>
          )}
        </div>
      )}
    </div>
  );
}
