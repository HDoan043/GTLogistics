"use client";

import React, { useState } from "react";
import { Home, Info, Truck, Phone, Flag, Image as ImageIcon } from "lucide-react";
import { HeroSectionEditor } from "./HeroSectionEditor";
import { HomeServicesEditor } from "./HomeServicesEditor";
import { BorderGatesEditor } from "./BorderGatesEditor";
import { WhyUsSectionEditor } from "./WhyUsSectionEditor";
import { StatsCounterEditor } from "./StatsCounterEditor";
import { AboutPageEditor } from "./AboutPageEditor";
import { ServicesPageEditor } from "./ServicesPageEditor";
import { ContactPageEditor } from "./ContactPageEditor";
import { PageBannersEditor } from "./PageBannersEditor";
import { MediaLibraryManager } from "./MediaLibraryManager";

interface ContentManagerTabsProps {
  initialContents: {
    hero: any;
    whyUs: any;
    stats: any;
    about: any;
    banners: any;
    homeServices?: any;
    borderGates?: any;
    contact?: any;
  };
  initialServices?: any[];
}

export function ContentManagerTabs({ initialContents, initialServices = [] }: ContentManagerTabsProps) {
  const [activeTab, setActiveTab] = useState<"home" | "about" | "services" | "contact" | "banners" | "media">("home");

  return (
    <div className="space-y-6">
      {/* Thanh Tab điều hướng chính */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">
        <button
          type="button"
          onClick={() => setActiveTab("home")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
            activeTab === "home"
              ? "bg-azure-600 text-white shadow-md shadow-azure-600/20"
              : "bg-white border border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-50"
          }`}
        >
          <Home className="w-4 h-4" />
          <span>Trang Chủ (Home)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("about")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
            activeTab === "about"
              ? "bg-azure-600 text-white shadow-md shadow-azure-600/20"
              : "bg-white border border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-50"
          }`}
        >
          <Info className="w-4 h-4" />
          <span>Trang Giới Thiệu (About)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("services")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
            activeTab === "services"
              ? "bg-azure-600 text-white shadow-md shadow-azure-600/20"
              : "bg-white border border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-50"
          }`}
        >
          <Truck className="w-4 h-4" />
          <span>4 Dịch Vụ Trọng Tâm</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("contact")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
            activeTab === "contact"
              ? "bg-azure-600 text-white shadow-md shadow-azure-600/20"
              : "bg-white border border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-50"
          }`}
        >
          <Phone className="w-4 h-4" />
          <span>Trang Liên Hệ & Điểm Trực</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("banners")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
            activeTab === "banners"
              ? "bg-azure-600 text-white shadow-md shadow-azure-600/20"
              : "bg-white border border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-50"
          }`}
        >
          <Flag className="w-4 h-4" />
          <span>Banners Toàn Trang</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("media")}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
            activeTab === "media"
              ? "bg-azure-600 text-white shadow-md shadow-azure-600/20"
              : "bg-white border border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-50"
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>Thư Viện Ảnh (Media)</span>
        </button>
      </div>

      {/* Nội dung từng Tab */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        {activeTab === "home" && (
          <div className="space-y-12">
            <HeroSectionEditor initialData={initialContents.hero} />
            <div className="pt-8 border-t border-slate-200">
              <HomeServicesEditor initialData={initialContents.homeServices} />
            </div>
            <div className="pt-8 border-t border-slate-200">
              <BorderGatesEditor initialData={initialContents.borderGates} />
            </div>
            <div className="pt-8 border-t border-slate-200">
              <WhyUsSectionEditor initialData={initialContents.whyUs} />
            </div>
            <div className="pt-8 border-t border-slate-200">
              <StatsCounterEditor initialData={initialContents.stats} />
            </div>
          </div>
        )}

        {activeTab === "about" && (
          <AboutPageEditor initialData={initialContents.about} />
        )}

        {activeTab === "services" && (
          <ServicesPageEditor initialServices={initialServices} />
        )}

        {activeTab === "contact" && (
          <ContactPageEditor initialData={initialContents.contact} />
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
