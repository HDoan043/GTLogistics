"use client";

import React, { useState, useEffect } from "react";
import { Phone, ArrowUp, MessageCircle } from "lucide-react";

interface FloatingContactProps {
  hotline?: string;
  zaloPhone?: string;
}

export function FloatingContact({
  hotline = "0904.382.268",
  zaloPhone = "0904382268",
}: FloatingContactProps) {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
          className="pointer-events-auto w-11 h-11 bg-slate-800/80 hover:bg-slate-900 text-white rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:-translate-y-1"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}

      {/* Nút Gọi Hotline Nhanh */}
      <a
        href={`tel:${cleanPhone}`}
        className="pointer-events-auto group relative flex items-center"
        title="Gọi hotline tư vấn ngay"
      >
        <div className="absolute right-12 pr-2 hidden group-hover:block transition-all duration-200">
          <div className="bg-slate-900 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg whitespace-nowrap">
            Hotline: {hotline}
          </div>
        </div>
        <div className="relative flex items-center justify-center w-14 h-14 bg-emerald-500 text-white rounded-full shadow-xl hover:bg-emerald-600 transition-all duration-300 hover:scale-105">
          <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
          <Phone className="w-6 h-6 relative z-10 animate-bounce" />
        </div>
      </a>

      {/* Nút Chat Zalo Nổi Tiện Ích */}
      <a
        href={`https://zalo.me/${zaloPhone}`}
        target="_blank"
        rel="noopener noreferrer"
        className="pointer-events-auto group relative flex items-center"
        title="Chat Zalo trực tiếp"
      >
        <div className="absolute right-12 pr-2 hidden group-hover:block transition-all duration-200">
          <div className="bg-blue-600 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg whitespace-nowrap">
            Chat Zalo với chúng tôi
          </div>
        </div>
        <div className="relative flex items-center justify-center w-14 h-14 bg-[#0068ff] text-white rounded-full shadow-xl hover:bg-blue-600 transition-all duration-300 hover:scale-105">
          <span className="absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75 animate-ping" />
          {/* Custom SVG logo Zalo hoặc MessageCircle */}
          <div className="relative z-10 flex flex-col items-center justify-center font-bold">
            <span className="text-xs uppercase tracking-tighter font-extrabold leading-none">ZALO</span>
            <MessageCircle className="w-3.5 h-3.5 mt-0.5" />
          </div>
        </div>
      </a>
    </div>
  );
}
