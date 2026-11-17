import React from "react";
import { QuoteCtaSection } from "@/components/home/QuoteCtaSection";
import { getSiteSettings } from "@/modules/settings/actions";

export const metadata = {
  title: "Yêu Cầu Báo Giá Cước Trực Tuyến | GT Logistics",
  description:
    "Nhận báo giá cước vận tải đường bộ liên vận Móng Cái, thủ tục hải quan xuất nhập khẩu, C/O Form E và sang tải kho bãi tối ưu chi phí nhất.",
};

export default async function QuotePage() {
  const settings = await getSiteSettings();

  return (
    <div className="flex flex-col min-h-screen">
      <QuoteCtaSection hotline={settings.hotline} isStandalonePage={true} />
    </div>
  );
}
