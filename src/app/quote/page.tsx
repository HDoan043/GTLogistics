import React from "react";
import { QuoteCtaSection } from "@/components/home/QuoteCtaSection";
import { getSiteSettings } from "@/modules/settings/actions";
import { Badge } from "@/components/ui/Badge";

export const metadata = {
  title: "Yêu Cầu Báo Giá Cước Trực Tuyến | GT Logistics",
  description:
    "Nhận báo giá cước vận tải đường bộ liên vận Móng Cái, thủ tục hải quan xuất nhập khẩu, C/O Form E và sang tải kho bãi tối ưu chi phí nhất.",
};

export default async function QuotePage() {
  const settings = await getSiteSettings();

  return (
    <div className="flex flex-col min-h-screen">
      <section className="relative py-16 bg-slate-950 text-white text-center border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Badge variant="accent" className="mb-2 uppercase tracking-wider">
            Báo Giá Trực Tuyến
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            YÊU CẦU BÁO GIÁ CƯỚC VẬN CHUYỂN & HẢI QUAN
          </h1>
          <p className="mt-2 text-sm text-slate-300 max-w-xl mx-auto">
            Điền thông tin tuyến đường và loại hàng để chuyên viên Logistics GT gửi bảng tính chi phí tối ưu nhất cho doanh nghiệp bạn trong 15 phút.
          </p>
        </div>
      </section>

      <QuoteCtaSection hotline={settings.hotline} />
    </div>
  );
}
