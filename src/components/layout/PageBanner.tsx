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
}

export function PageBanner({
  breadcrumbs,
  title,
  subtitle,
  badge,
}: PageBannerProps) {
  return (
    <section className="relative py-8 sm:py-10 bg-slate-950 text-white overflow-hidden border-b border-slate-800">
      {/* Nền tối sâu với vân watermark thương hiệu mờ nhẹ bên phải */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/95 to-slate-900 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb nhỏ gọn, tinh tế */}
        <nav aria-label="Breadcrumb" className="flex items-center flex-wrap gap-1.5 text-xs text-slate-400 mb-2.5">
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

        {/* Tiêu đề ngắn gọn, sắc nét */}
        <div className="max-w-3xl">
          {badge && (
            <span className="inline-block px-2.5 py-0.5 rounded-md bg-azure-900/80 text-azure-300 border border-azure-700/60 text-[11px] font-bold mb-2">
              {badge}
            </span>
          )}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
