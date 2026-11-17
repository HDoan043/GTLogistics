"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
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
}

export function PageBanner({
  breadcrumbs,
  title,
  subtitle,
  badge,
  size = "compact",
}: PageBannerProps) {
  const isMain = size === "main";

  return (
    <section
      className={`relative bg-slate-950 text-white overflow-hidden border-b border-slate-800 ${
        isMain
          ? "py-16 sm:py-24 lg:py-28 flex flex-col justify-center"
          : "py-8 sm:py-10"
      }`}
    >
      {/* Nền tối sâu với chuyển sắc mềm mại */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/95 to-slate-900 pointer-events-none" />

      {/* Watermark logo GT LOGISTICS hiển thị mờ nghệ thuật phía bên phải theo đúng ảnh thực tế */}
      <div className="absolute right-4 sm:right-8 lg:right-16 top-1/2 -translate-y-1/2 w-64 sm:w-80 lg:w-96 h-40 sm:h-52 lg:h-60 pointer-events-none opacity-15 select-none">
        <Image
          src="/images/gt_logo.webp"
          alt="GT Logistics Watermark"
          fill
          className="object-contain object-right"
          priority
        />
      </div>

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
