"use client";

import React, { useState } from "react";
import { Home, Info, Flag, Image as ImageIcon } from "lucide-react";
import { HeroSectionEditor } from "./HeroSectionEditor";
import { WhyUsSectionEditor } from "./WhyUsSectionEditor";
import { StatsCounterEditor } from "./StatsCounterEditor";
import { AboutPageEditor } from "./AboutPageEditor";
import { PageBannersEditor } from "./PageBannersEditor";
import { MediaLibraryManager } from "./MediaLibraryManager";

interface ContentManagerTabsProps {
  initialContents: {
    hero: any;
    whyUs: any;
    stats: any;
    about: any;
    banners: any;
  };
}

export function ContentManagerTabs({ initialContents }: ContentManagerTabsProps) {
  const [activeTab, setActiveTab] = useState<"home" | "about" | "banners" | "media">("home");

  return (
    <div className="space-y-6">
      {/* Thanh Tab điều hướng chính */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
        <button
          type="button"
          onClick={() => setActiveTab("home")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-colors ${
            activeTab === "home"
              ? "bg-azure-600 text-white shadow-md shadow-azure-600/20"
              : "bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800"
          }`}
        >
          <Home className="w-4 h-4" />
          <span>Trang Chủ (Home)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("about")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-colors ${
            activeTab === "about"
              ? "bg-azure-600 text-white shadow-md shadow-azure-600/20"
              : "bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800"
          }`}
        >
          <Info className="w-4 h-4" />
          <span>Trang Giới Thiệu (About)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("banners")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-colors ${
            activeTab === "banners"
              ? "bg-azure-600 text-white shadow-md shadow-azure-600/20"
              : "bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800"
          }`}
        >
          <Flag className="w-4 h-4" />
          <span>Banners Toàn Trang</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("media")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-colors ${
            activeTab === "media"
              ? "bg-azure-600 text-white shadow-md shadow-azure-600/20"
              : "bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800"
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>Thư Viện Ảnh (Media)</span>
        </button>
      </div>

      {/* Nội dung từng Tab */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 sm:p-8 shadow-sm">
        {activeTab === "home" && (
          <div className="space-y-12">
            <HeroSectionEditor initialData={initialContents.hero} />
            <div className="pt-8 border-t border-slate-800">
              <WhyUsSectionEditor initialData={initialContents.whyUs} />
            </div>
            <div className="pt-8 border-t border-slate-800">
              <StatsCounterEditor initialData={initialContents.stats} />
            </div>
          </div>
        )}

        {activeTab === "about" && (
          <AboutPageEditor initialData={initialContents.about} />
        )}

        {activeTab === "banners" && (
          <PageBannersEditor initialData={initialContents.banners} />
        )}

        {activeTab === "media" && (
          <MediaLibraryManager />
        )}
      </div>
    </div>
  );
}
