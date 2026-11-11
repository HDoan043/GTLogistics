"use client";

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
    <div className={`inline-flex items-center gap-3.5 ${className}`}>
      {/* Official 3D Gold & Azure GT Emblem */}
      <div className="relative shrink-0 flex items-center justify-center">
        <Image
          src="/images/gt_logo.webp"
          alt="GT Logistics Logo"
          width={180}
          height={108}
          className="h-10 sm:h-12 w-auto object-contain drop-shadow-sm hover:scale-105 transition-transform duration-300"
          priority
        />
      </div>

      {/* Brand Typography & Verification Subtitle */}
      {variant !== "iconOnly" && (
        <div className="hidden sm:flex flex-col justify-center border-l border-slate-200/80 dark:border-slate-800 pl-3">
          <div className="flex items-baseline gap-1.5 leading-tight">
            <span
              className={`font-black text-base sm:text-lg tracking-tight ${
                isDark ? "text-white" : "text-slate-950"
              }`}
            >
              GT LOGISTICS
            </span>
            <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/30 tracking-wider">
              Móng Cái
            </span>
          </div>

          <span
            className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-wider mt-0.5 ${
              isDark ? "text-amber-400/90" : "text-slate-500"
            }`}
          >
            {showSlogan
              ? "Đồng hành tin cậy - Phát triển bền vững"
              : "Tiếp Vận & Xuất Nhập Khẩu Chính Ngạch"}
          </span>
        </div>
      )}
    </div>
  );
}
