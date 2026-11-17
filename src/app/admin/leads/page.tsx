import React from "react";
import { redirect } from "next/navigation";
import {
  Users,
  Phone,
  Mail,
  Building,
  MapPin,
  Clock,
  CheckCircle,
} from "lucide-react";
import { prisma } from "@/lib/db";
import { getCurrentAdmin } from "@/lib/auth";
import { Badge } from "@/components/ui/Badge";
import { updateLeadStatus } from "@/modules/leads/actions";

export default async function AdminLeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    redirect("/admin/login");
  }

  const { status } = await searchParams;
  const where: Record<string, unknown> = {};
  if (status && status !== "ALL") {
    where.status = status;
  }

  const leads = await prisma.lead.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-6 sm:p-10 max-w-7xl mx-auto space-y-6 bg-slate-950 text-slate-100">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-azure-950 text-azure-400 border border-azure-800/60">
              Lead Dispatch
            </span>
            <span className="text-[11px] text-slate-400">
              <strong className="font-mono tabular-nums text-slate-200">{leads.length}</strong> yêu cầu
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Quản Lý Leads & Báo Giá
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Theo dõi và xử lý các yêu cầu báo giá cước, tư vấn hải quan từ khách hàng.
          </p>
        </div>
      </div>

      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 shadow-sm overflow-hidden">
        {leads.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            Chưa có yêu cầu báo giá nào từ khách hàng.
          </div>
        ) : (
          <div className="divide-y divide-slate-800">
            {leads.map((lead) => {
              const dateStr = new Date(lead.createdAt).toLocaleString("vi-VN", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              });

              return (
                <div key={lead.id} className="p-6 hover:bg-slate-800/30 transition-colors">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Thông tin khách hàng */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <span className="text-base font-bold text-white">
                          {lead.fullName}
                        </span>
                        {lead.company && (
                          <span className="text-xs text-slate-400 flex items-center gap-1">
                            <Building className="w-3.5 h-3.5 text-slate-500" />
                            <span>{lead.company}</span>
                          </span>
                        )}
                        <span
                          className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                            lead.status === "NEW"
                              ? "bg-amber-950 text-amber-300 border border-amber-800/60"
                              : lead.status === "CONTACTED"
                              ? "bg-azure-950 text-azure-300 border border-azure-800/60"
                              : "bg-emerald-950 text-emerald-300 border border-emerald-800/60"
                          }`}
                        >
                          {lead.status === "NEW"
                            ? "Mới tiếp nhận"
                            : lead.status === "CONTACTED"
                            ? "Đang tư vấn"
                            : "Đã chốt hợp đồng"}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
                        <a
                          href={`tel:${lead.phone.replace(/[^0-9]/g, "")}`}
                          className="flex items-center gap-1.5 font-bold text-azure-400 hover:text-azure-300 hover:underline"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span className="font-mono tabular-nums">{lead.phone}</span>
                        </a>

                        {lead.email && (
                          <span className="flex items-center gap-1.5 text-slate-400 font-mono">
                            <Mail className="w-3.5 h-3.5" />
                            <span>{lead.email}</span>
                          </span>
                        )}

                        <span className="flex items-center gap-1.5 text-slate-500">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Gửi lúc: <strong className="font-mono tabular-nums text-slate-400">{dateStr}</strong></span>
                        </span>
                      </div>

                      {/* Chi tiết tuyến đường & lô hàng */}
                      <div className="pt-2 text-xs space-y-1">
                        <div>
                          <span className="font-semibold text-slate-400">Dịch vụ:</span>{" "}
                          <span className="text-gold-300 font-bold">{lead.serviceType}</span>
                        </div>
                        {(lead.routeOrigin || lead.routeDestination) && (
                          <div className="flex items-center gap-1 text-slate-300 text-[11px]">
                            <MapPin className="w-3.5 h-3.5 text-azure-400 shrink-0" />
                            <span>
                              {lead.routeOrigin || "Chưa rõ"} ➔ {lead.routeDestination || "Chưa rõ"}
                            </span>
                          </div>
                        )}
                        {lead.cargoDetails && (
                          <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-300 mt-2 text-xs">
                            <strong className="text-slate-400">Chi tiết hàng hóa:</strong> {lead.cargoDetails}
                          </div>
                        )}
                        {lead.notes && (
                          <div className="text-[11px] text-amber-300 bg-amber-950/80 border border-amber-800/60 p-2 rounded-lg mt-1">
                            <strong>Ghi chú nội bộ:</strong> {lead.notes}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Cập nhật trạng thái nhanh */}
                    <div className="flex items-center gap-2 shrink-0">
                      <form
                        action={async (formData: FormData) => {
                          "use server";
                          const newStatus = formData.get("status") as string;
                          await updateLeadStatus(lead.id, newStatus);
                        }}
                        className="flex items-center gap-2"
                      >
                        <select
                          name="status"
                          defaultValue={lead.status}
                          className="px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs font-semibold text-slate-200 focus:border-azure-500 focus:outline-none"
                        >
                          <option value="NEW">Mới tiếp nhận</option>
                          <option value="CONTACTED">Đang tư vấn</option>
                          <option value="QUOTED">Đã gửi báo giá</option>
                          <option value="CLOSED">Đã chốt hợp đồng</option>
                        </select>
                        <button
                          type="submit"
                          className="px-3 py-1.5 bg-azure-600 hover:bg-azure-500 text-white rounded-lg text-xs font-bold transition-colors tap-press"
                        >
                          Lưu
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
