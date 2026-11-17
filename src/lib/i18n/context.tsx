"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Locale, Dictionary, getDictionary } from "./index";

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Dictionary;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({
  children,
  initialLocale = "vi",
}: {
  children: React.ReactNode;
  initialLocale?: Locale;
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);
  const router = useRouter();

  // Đọc cookie khi component mount ở client nếu có
  useEffect(() => {
    const match = document.cookie.match(/(?:^|;\s*)NEXT_LOCALE=([^;]*)/);
    if (match && (match[1] === "vi" || match[1] === "en" || match[1] === "zh")) {
      setLocaleState(match[1] as Locale);
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    if (newLocale === locale) return;
    setLocaleState(newLocale);
    // Lưu vào Cookie 1 năm
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
    // Refresh Next.js App Router để Server Components lấy lại dữ liệu theo ngôn ngữ mới
    router.refresh();
  };

  const t = getDictionary(locale);

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
