"use client";

import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageBannerProps {
  breadcrumbs: BreadcrumbItem[];
  title: string;
  subtitle?: string;
  badge?: string;
  size?: "compact" | "main";
  bgImage?: string;
  bgScale?: number;
  bgPosition?: string;
  bgOpacity?: number;
}

export function PageBanner({
  breadcrumbs,
  title,
  subtitle,
  badge,
  size = "compact",
  bgImage,
  bgScale = 100,
  bgPosition = "center",
  bgOpacity = 30,
}: PageBannerProps) {
  const isMain = size === "main";
  const effectiveBgImage = bgImage || "/images/vietphuc/hero_fleet_6k3a8950.webp";
  const effectiveOpacity = bgOpacity ?? 45;

  return (
    <section
      className={`relative bg-slate-950 text-white overflow-hidden border-b border-slate-800 ${
        isMain
          ? "py-16 sm:py-24 lg:py-28 flex flex-col justify-center"
          : "py-8 sm:py-10"
      }`}
    >
      {/* Ảnh nền thực tế duy nhất, không chèn watermark logo chồng chéo */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center pointer-events-none"
        style={{
          backgroundImage: `url('${effectiveBgImage}')`,
          backgroundSize: `${bgScale || 100}%`,
          backgroundPosition: bgPosition || "center",
          opacity: effectiveOpacity / 100,
        }}
      />

      {/* Lớp phủ chuyển màu gradient nhẹ nhàng để chữ đọc sắc nét */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/85 to-slate-950/30 z-0 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Breadcrumb nhỏ gọn, tinh tế */}
        <nav aria-label="Breadcrumb" className="flex items-center flex-wrap gap-1.5 text-xs text-slate-400 mb-3">
          {breadcrumbs.map((item, idx) => {
            const isLast = idx === breadcrumbs.length - 1;
            return (
              <React.Fragment key={idx}>
                {idx > 0 && <ChevronRight className="w-3 h-3 text-slate-600 shrink-0" />}
                {item.href && !isLast ? (
                  <Link
                    href={item.href}
                    className="hover:text-gold-300 transition-colors duration-150"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span className={isLast ? "text-azure-400 font-medium truncate max-w-xs sm:max-w-md" : ""}>
                    {item.label}
                  </span>
                )}
              </React.Fragment>
            );
          })}
        </nav>

        {/* Tiêu đề ngắn gọn, phân cấp rõ rệt */}
        <div className="max-w-3xl">
          {badge && (
            <span className="inline-block px-2.5 py-0.5 rounded-md bg-azure-900/80 text-azure-300 border border-azure-700/60 text-[11px] font-bold mb-2.5">
              {badge}
            </span>
          )}
          <h1
            className={`font-black text-white tracking-tight leading-tight ${
              isMain
                ? "text-3xl sm:text-4xl lg:text-5xl"
                : "text-2xl sm:text-3xl lg:text-4xl"
            }`}
          >
            {title}
          </h1>
          {subtitle && (
            <p
              className={`text-slate-300 leading-relaxed font-normal ${
                isMain
                  ? "mt-3.5 sm:mt-4 text-sm sm:text-base max-w-2xl"
                  : "mt-2 text-xs sm:text-sm max-w-2xl"
              }`}
            >
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
