"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Phone, ArrowUp, MessageCircle } from "lucide-react";

interface FloatingContactProps {
  hotline?: string;
  zaloPhone?: string;
}

export function FloatingContact({
  hotline = "0904.382.268",
  zaloPhone = "0904382268",
}: FloatingContactProps) {
  const pathname = usePathname();
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Không hiển thị các nút liên hệ nổi công khai trong khu vực quản trị (/admin/*)
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cleanPhone = hotline.replace(/[^0-9]/g, "");

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 pointer-events-none">
      {/* Nút Cuộn Lên Đầu Trang */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          title="Lên đầu trang"
          className="pointer-events-auto w-11 h-11 bg-slate-900/90 hover:bg-slate-950 text-white rounded-full flex items-center justify-center shadow-lg transition-transform duration-200 motion-safe:hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}

      {/* Nút Gọi Hotline Nhanh */}
      <a
        href={`tel:${cleanPhone}`}
        className="pointer-events-auto group relative flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 rounded-full"
        title="Gọi hotline tư vấn ngay"
      >
        <div className="absolute right-12 pr-2 hidden group-hover:block transition-opacity duration-200">
          <div className="bg-slate-950 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg whitespace-nowrap border border-slate-800">
            Hotline: {hotline}
          </div>
        </div>
        <div className="relative flex items-center justify-center w-14 h-14 bg-emerald-600 text-white rounded-full shadow-lg hover:bg-emerald-700 transition-transform duration-200 motion-safe:hover:scale-105">
          <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 motion-safe:animate-ping" />
          <Phone className="w-6 h-6 relative z-10" />
        </div>
      </a>

      {/* Nút Chat Zalo Nổi Tiện Ích */}
      <a
        href={`https://zalo.me/${zaloPhone}`}
        target="_blank"
        rel="noopener noreferrer"
        className="pointer-events-auto group relative flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure-400 rounded-full"
        title="Chat Zalo trực tiếp"
      >
        <div className="absolute right-12 pr-2 hidden group-hover:block transition-opacity duration-200">
          <div className="bg-slate-950 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg whitespace-nowrap border border-slate-800">
            Chat Zalo với chúng tôi
          </div>
        </div>
        <div className="relative flex items-center justify-center w-14 h-14 bg-azure-500 text-white rounded-full shadow-lg hover:bg-azure-600 transition-transform duration-200 motion-safe:hover:scale-105">
          <span className="absolute inline-flex h-full w-full rounded-full bg-azure-300 opacity-75 motion-safe:animate-ping" />
          <div className="relative z-10 flex flex-col items-center justify-center font-bold">
            <span className="text-xs font-bold leading-none">Zalo</span>
            <MessageCircle className="w-3.5 h-3.5 mt-0.5" />
          </div>
        </div>
      </a>
    </div>
  );
}
