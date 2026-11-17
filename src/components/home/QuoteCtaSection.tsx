"use client";

import React, { useState } from "react";
import { Send, CheckCircle2, PhoneCall, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { submitLead } from "@/modules/leads/actions";
import { useLanguage } from "@/lib/i18n/context";

export function QuoteCtaSection({ hotline = "0904.382.268" }: { hotline?: string }) {
  const { t, locale } = useLanguage();

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    company: "",
    serviceType: "Vận tải đường bộ & liên vận Móng Cái",
    routeOrigin: "",
    routeDestination: "",
    cargoDetails: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{
    type: "idle" | "success" | "error";
    message: string;
  }>({
    type: "idle",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: "idle", message: "" });

    const result = await submitLead(formData);
    setLoading(false);

    if (result.success) {
      setStatus({
        type: "success",
        message: t.quoteForm.successMsg,
      });
      setFormData({
        fullName: "",
        phone: "",
        email: "",
        company: "",
        serviceType: "Vận tải đường bộ & liên vận Móng Cái",
        routeOrigin: "",
        routeDestination: "",
        cargoDetails: "",
        message: "",
      });
    } else {
      setStatus({
        type: "error",
        message: result.message || t.quoteForm.errorMsg,
      });
    }
  };

  const cleanPhone = hotline.replace(/[^0-9]/g, "");

  return (
    <section className="py-20 bg-slate-950 text-white relative border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Cột trái: Lời kêu gọi */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-slate-900 text-gold-300 text-xs font-semibold rounded-full border border-gold-500/25">
              <span>{t.quoteForm.badge}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
              {t.quoteForm.heading}
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              {t.quoteForm.desc}
            </p>

            <div className="p-6 rounded-3xl bg-slate-900 border border-gold-500/20 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-gold-500 to-gold-600 flex items-center justify-center text-slate-950 font-black shrink-0 shadow-lg shadow-gold-500/20">
                  <PhoneCall className="w-6 h-6 text-slate-950" />
                </div>
                <div>
                  <div className="text-xs text-slate-400">{t.quoteForm.callExpert}</div>
                  <a
                    href={`tel:${cleanPhone}`}
                    className="text-xl font-black text-gold-300 hover:text-gold-200 hover:underline transition-colors"
                  >
                    {hotline}
                  </a>
                </div>
              </div>
              <div className="text-xs text-slate-300 space-y-1">
                <div>{t.quoteForm.benefit1}</div>
                <div>{t.quoteForm.benefit2}</div>
              </div>
            </div>
          </div>

          {/* Cột phải: Form Báo Giá */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl p-6 sm:p-10 text-slate-800 shadow-md border border-slate-100">
              <h3 className="text-2xl font-black text-slate-900 mb-2">
                {t.quoteForm.formTitle}
              </h3>
              <p className="text-xs text-slate-500 mb-6">
                {t.quoteForm.formSubtitle}
              </p>

              {status.type === "success" && (
                <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="text-sm font-semibold">{status.message}</div>
                </div>
              )}

              {status.type === "error" && (
                <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  <div className="text-sm font-semibold">{status.message}</div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      {t.quoteForm.fullName} *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) =>
                        setFormData({ ...formData, fullName: e.target.value })
                      }
                      placeholder={locale === "zh" ? "张三 (Mr. Zhang)" : locale === "en" ? "John Doe" : "Nguyễn Văn A"}
                      className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure-500 focus:bg-white transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      {t.quoteForm.phone} *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      placeholder={locale === "zh" ? "+86 138-0000-0000 / 微信" : "0912.345.678"}
                      className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure-500 focus:bg-white transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      {t.quoteForm.serviceType} *
                    </label>
                    <select
                      value={formData.serviceType}
                      onChange={(e) =>
                        setFormData({ ...formData, serviceType: e.target.value })
                      }
                      className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure-500 focus:bg-white transition-colors"
                    >
                      <option value="Vận tải đường bộ">
                        {locale === "zh" ? "跨境公路运输 (Road Trucking)" : locale === "en" ? "Cross-Border Trucking" : "Vận tải đường bộ"}
                      </option>
                      <option value="Thủ tục hải quan & C/O">
                        {locale === "zh" ? "海关报关与 C/O Form E" : locale === "en" ? "Customs & C/O Form E" : "Thủ tục hải quan & C/O"}
                      </option>
                      <option value="Ủy thác xuất nhập khẩu">
                        {locale === "zh" ? "进出口外贸代理 (Entrustment)" : locale === "en" ? "Trade Entrustment" : "Ủy thác xuất nhập khẩu"}
                      </option>
                      <option value="Kho bãi & sang tải">
                        {locale === "zh" ? "边贸仓储与过驳 (Warehousing)" : locale === "en" ? "Warehousing & Cross-Dock" : "Kho bãi & sang tải"}
                      </option>
                      <option value="Logistics chuỗi lạnh">
                        {locale === "zh" ? "冷链农产品物流 (Cold Chain)" : locale === "en" ? "Cold Chain Logistics" : "Logistics chuỗi lạnh"}
                      </option>
                      <option value="Vận tải đa phương thức">
                        {locale === "zh" ? "国际多式联运 (Multimodal)" : locale === "en" ? "Multimodal Transport" : "Vận tải đa phương thức"}
                      </option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      {t.quoteForm.company}
                    </label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) =>
                        setFormData({ ...formData, company: e.target.value })
                      }
                      placeholder={locale === "zh" ? "某某进出口贸易有限公司" : "Công ty TNHH / Company"}
                      className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure-500 focus:bg-white transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      {t.quoteForm.routeOrigin}
                    </label>
                    <input
                      type="text"
                      value={formData.routeOrigin}
                      onChange={(e) =>
                        setFormData({ ...formData, routeOrigin: e.target.value })
                      }
                      placeholder={locale === "zh" ? "东兴 / 广州 / 义乌 / 防城港" : "Đông Hưng / Phật Sơn / Hải Phòng..."}
                      className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure-500 focus:bg-white transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      {t.quoteForm.routeDestination}
                    </label>
                    <input
                      type="text"
                      value={formData.routeDestination}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          routeDestination: e.target.value,
                        })
                      }
                      placeholder={locale === "zh" ? "芒街 / 河内 / 海防 / 平阳" : "Móng Cái / Hà Nội / Bắc Ninh..."}
                      className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure-500 focus:bg-white transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t.quoteForm.cargoDetails}
                  </label>
                  <textarea
                    rows={2}
                    value={formData.cargoDetails}
                    onChange={(e) =>
                      setFormData({ ...formData, cargoDetails: e.target.value })
                    }
                    placeholder={locale === "zh" ? "品名、集装箱柜型 (40HC/冷柜)、重量、HS编码等" : "Ví dụ: 2 container 40HC linh kiện điện tử, 45 tấn hoa quả lạnh..."}
                    className="w-full px-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure-500 focus:bg-white transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {t.quoteForm.message}
                  </label>
                  <input
                    type="text"
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    placeholder={locale === "zh" ? "提货时间、特殊装卸要求等" : "Ghi chú thêm về thời gian giao nhận..."}
                    className="w-full px-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure-500 focus:bg-white transition-colors"
                  />
                </div>

                <Button
                  type="submit"
                  variant="accent"
                  size="lg"
                  className="w-full font-bold mt-2"
                  isLoading={loading}
                >
                  <Send className="w-4 h-4 mr-2" />
                  <span>{loading ? t.quoteForm.submitting : t.quoteForm.btnSubmit}</span>
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
