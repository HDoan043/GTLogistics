"use client";

import React from "react";
import { useLanguage } from "@/lib/i18n/context";

export function TrustedPartners() {
  const { locale } = useLanguage();

  const title =
    locale === "zh"
      ? "信赖合作伙伴"
      : locale === "en"
      ? "Trusted Corporate Partners"
      : "Đối Tác Doanh Nghiệp Tin Tưởng";

  const partners = [
    { name: "LG Electronics", label: "LG" },
    { name: "Panasonic Corporation", label: "Panasonic" },
    { name: "Xiaomi Global", label: "Xiaomi" },
    { name: "Foxconn Group", label: "Foxconn" },
    { name: "Samsung Logistics", label: "Samsung" },
  ];

  return (
    <section className="bg-slate-50/80 border-b border-slate-200/80 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs font-bold text-slate-500 shrink-0">
            {title}:
          </div>
          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-6 sm:gap-10">
            {partners.map((p, idx) => (
              <div
                key={idx}
                className="text-slate-600 hover:text-azure-700 font-extrabold text-sm sm:text-base tracking-tight transition-colors duration-150"
              >
                {p.label}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
