"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Search,
  Clock,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { trackOrder, TimelineEvent } from "@/modules/tracking/actions";
import { useLanguage } from "@/lib/i18n/context";

interface OrderData {
  id: string;
  trackingCode: string;
  customerName: string;
  origin: string;
  destination: string;
  status: string;
  statusLabel: string;
  currentHub: string;
  timeline: TimelineEvent[];
}

function TrackingContent() {
  const searchParams = useSearchParams();
  const initialCode = searchParams.get("code") || "";
  const { t, locale } = useLanguage();

  const [code, setCode] = useState(initialCode);
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<OrderData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialCode) {
      handleSearch(initialCode);
    }
  }, [initialCode]);

  const handleSearch = async (trackingCodeToSearch: string) => {
    if (!trackingCodeToSearch.trim()) return;
    setLoading(true);
    setError(null);
    setOrder(null);

    const res = await trackOrder(trackingCodeToSearch);
    setLoading(false);

    if (res.success && res.order) {
      setOrder(res.order as unknown as OrderData);
    } else {
      setError(res.message || t.trackingPage.notFound);
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(code);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Box Tìm kiếm Vận đơn */}
      <div className="bg-slate-900/90 p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-md mb-8 text-white">
        <h2 className="text-xl font-bold text-white mb-2">
          {t.hero.trackingTitle}
        </h2>
        <p className="text-xs text-slate-400 mb-6">
          {t.hero.trackingDesc}
        </p>

        <form onSubmit={onSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder={t.trackingPage.inputPlaceholder}
              className="w-full px-4 py-3 text-sm bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure-500 font-mono font-semibold"
            />
          </div>
          <Button
            type="submit"
            variant="accent"
            size="md"
            isLoading={loading}
            className="font-bold py-3 px-6 tap-press shadow-md shadow-gold-500/10"
          >
            <Search className="w-4 h-4 mr-2" />
            <span>{t.trackingPage.btnTrack}</span>
          </Button>
        </form>

        <div className="mt-4 text-xs text-slate-400 flex items-center gap-2 flex-wrap">
          <span className="font-semibold text-slate-300">{t.hero.trackingSamples}:</span>
          <button
            type="button"
            onClick={() => {
              setCode("GT889922");
              handleSearch("GT889922");
            }}
            className="font-mono text-azure-300 font-bold hover:text-white bg-azure-950/80 hover:bg-azure-900 px-2.5 py-1 rounded-lg transition-colors border border-azure-800/80 tap-press"
          >
            GT889922
          </button>
          <button
            type="button"
            onClick={() => {
              setCode("GT556677");
              handleSearch("GT556677");
            }}
            className="font-mono text-azure-300 font-bold hover:text-white bg-azure-950/80 hover:bg-azure-900 px-2.5 py-1 rounded-lg transition-colors border border-azure-800/80 tap-press"
          >
            GT556677
          </button>
        </div>
      </div>

      {/* Thông báo lỗi */}
      {error && (
        <div className="p-6 bg-rose-950/80 border border-rose-800/80 rounded-2xl flex items-start gap-3 text-rose-300 mb-8">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold text-sm">
              {locale === "zh" ? "未查询到运单数据" : locale === "en" ? "Shipment Not Found" : "Không tìm thấy dữ liệu vận đơn"}
            </h4>
            <p className="text-xs mt-1 leading-relaxed">{error}</p>
          </div>
        </div>
      )}

      {/* Kết quả Vận đơn */}
      {order && (
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 shadow-md overflow-hidden space-y-6 text-white">
          {/* Header kết quả */}
          <div className="p-6 sm:p-8 bg-slate-950 border-b border-slate-800 text-white flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div>
              <div className="text-xs text-slate-400 font-medium">
                {locale === "zh" ? "GT 跨境物流专属提单号" : locale === "en" ? "GT Logistics Tracking Number" : "Mã Vận Đơn Logistics GT"}
              </div>
              <div className="text-2xl sm:text-3xl font-black font-mono text-gold-400 mt-1">
                {order.trackingCode}
              </div>
              <div className="text-xs text-slate-300 mt-1">
                {locale === "zh" ? "托运单位 / 客户:" : locale === "en" ? "Consignee:" : "Khách hàng:"}{" "}
                <span className="font-bold text-white">{order.customerName}</span>
              </div>
            </div>

            <div>
              <Badge
                variant={order.status === "DELIVERED" ? "success" : "accent"}
                className="text-xs px-3 py-1 font-bold shadow-sm"
              >
                {order.statusLabel}
              </Badge>
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-8">
            {/* Tuyến đường & Vị trí hiện tại */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs">
              <div>
                <span className="text-slate-400 block font-semibold">{t.trackingPage.origin}:</span>
                <span className="font-bold text-white text-sm mt-0.5 block">
                  {order.origin}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block font-semibold">{t.trackingPage.destination}:</span>
                <span className="font-bold text-white text-sm mt-0.5 block">
                  {order.destination}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block font-semibold">{t.trackingPage.currentLocation}:</span>
                <span className="font-bold text-azure-400 text-sm mt-0.5 block">
                  {order.currentHub}
                </span>
              </div>
            </div>

            {/* Dòng thời gian lịch trình */}
            <div>
              <h3 className="font-bold text-white text-base mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-gold-400" />
                <span>{t.trackingPage.timeline}</span>
              </h3>

              <div className="relative border-l-2 border-slate-800 ml-4 space-y-6">
                {order.timeline.map((event, idx) => (
                  <div key={idx} className="relative pl-6">
                    <div className="absolute -left-2 top-0.5 w-4 h-4 rounded-full bg-gold-500 border-4 border-slate-900 shadow-sm" />
                    <div className="text-xs text-slate-400 font-mono">{event.time}</div>
                    <div className="text-sm font-bold text-white mt-0.5">{event.location}</div>
                    <div className="text-xs text-slate-400 mt-1">{event.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function TrackingPageWrapper() {
  const { t } = useLanguage();
  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-white">
      <section className="relative py-16 bg-slate-950 text-white text-center border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Badge variant="accent" className="mb-2">
            {t.trackingPage.badge}
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            {t.trackingPage.title}
          </h1>
          <p className="mt-2 text-sm text-slate-300 max-w-xl mx-auto">
            {t.trackingPage.subtitle}
          </p>
        </div>
      </section>

      <Suspense fallback={<div className="text-center py-20 text-slate-400 font-mono">Đang tải dữ liệu...</div>}>
        <TrackingContent />
      </Suspense>
    </div>
  );
}

export default function TrackingPage() {
  return <TrackingPageWrapper />;
}
