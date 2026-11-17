"use client";

import React from "react";
import Image from "next/image";
import { useLanguage } from "@/lib/i18n/context";

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

  let subtitle = showSlogan
    ? "Đồng hành tin cậy - Phát triển bền vững"
    : "Tiếp vận & xuất nhập khẩu chính ngạch";

  try {
    const { t } = useLanguage();
    if (t?.common) {
      subtitle = showSlogan ? t.common.slogan : t.common.companySubtitle;
    }
  } catch {
    // Outside LanguageProvider context fallback
  }

  return (
    <div className={`inline-flex items-center gap-3.5 ${className}`}>
      {/* Official 3D Gold & Azure GT Emblem */}
      <div className="relative shrink-0 flex items-center justify-center">
        <Image
          src="/images/gt_logo.webp"
          alt="GT Logistics Logo"
          width={180}
          height={108}
          className="h-10 sm:h-12 w-auto object-contain drop-shadow-sm"
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
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-gold-500/10 text-gold-700 dark:text-gold-400 border border-gold-500/20">
              Móng Cái
            </span>
          </div>

          <span
            className={`text-xs font-medium mt-0.5 ${
              isDark ? "text-gold-400/90" : "text-slate-500"
            }`}
          >
            {subtitle}
          </span>
        </div>
      )}
    </div>
  );
}
