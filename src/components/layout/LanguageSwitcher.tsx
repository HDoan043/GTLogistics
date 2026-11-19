"use client";

import React from "react";
import { Globe } from "lucide-react";
import { useLanguage } from "@/lib/i18n/context";
import { Locale } from "@/lib/i18n";

const LANGUAGES: Array<{ code: Locale; label: string; title: string }> = [
  { code: "vi", label: "VN", title: "Tiếng Việt" },
  { code: "en", label: "EN", title: "English" },
  { code: "zh", label: "中文", title: "中文 (Chinese)" },
];

export function LanguageSwitcher({ className = "" }: { className?: string }) {
  const { locale, setLocale } = useLanguage();

  return (
    <div
      className={`inline-flex items-center gap-1 bg-slate-100/90 p-1 rounded-xl border border-slate-200/80 ${className}`}
      role="group"
      aria-label="Chọn ngôn ngữ"
    >
      <Globe className="w-3.5 h-3.5 text-azure-600 ml-1.5 mr-0.5 shrink-0" />
      {LANGUAGES.map((lang) => {
        const isActive = locale === lang.code;
        return (
          <button
            key={lang.code}
            type="button"
            onClick={() => setLocale(lang.code)}
            title={lang.title}
            className={`min-h-[38px] px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 ${
              isActive
                ? "bg-gold-500 text-slate-950 font-bold shadow-sm"
                : "text-slate-600 hover:text-slate-900 hover:bg-white"
            }`}
          >
            {lang.label}
          </button>
        );
      })}
    </div>
  );
}
