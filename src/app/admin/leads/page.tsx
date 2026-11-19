import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Users,
  Phone,
  Mail,
  Building,
  MapPin,
  Clock,
  CheckCircle,
  FileSpreadsheet,
  Filter,
} from "lucide-react";
import { prisma } from "@/lib/db";
import { getCurrentAdmin } from "@/lib/auth";
import { Badge } from "@/components/ui/Badge";
import { updateLeadStatus } from "@/modules/leads/actions";
import { ExportLeadsButton } from "@/components/admin/leads/ExportLeadsButton";
import { CleanupLeadsModal } from "@/components/admin/leads/CleanupLeadsModal";

function formatDateTag(d?: Date | null): string {
  if (!d) return "";
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
}

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
  const currentStatus = status || "ALL";

  const where: Record<string, unknown> = {};
  if (status && status !== "ALL") {
    where.status = status;
  }

  const [leads, counts, earliestLead, latestLead] = await Promise.all([
    prisma.lead.findMany({
      where,
      orderBy: { createdAt: "desc" },
    }),
    prisma.lead.groupBy({
      by: ["status"],
      _count: { id: true },
    }),
    prisma.lead.findFirst({
      orderBy: { createdAt: "asc" },
      select: { createdAt: true },
    }),
    prisma.lead.findFirst({
      orderBy: { createdAt: "desc" },
      select: { createdAt: true },
    }),
  ]);

  const countMap = counts.reduce((acc, curr) => {
    acc[curr.status] = curr._count.id;
    return acc;
  }, {} as Record<string, number>);

  const totalAll = Object.values(countMap).reduce((a, b) => a + b, 0);
  const completedLeads = (countMap["CLOSED"] || 0) + (countMap["QUOTED"] || 0);
  const earliestDateStr = formatDateTag(earliestLead?.createdAt);
  const latestDateStr = formatDateTag(latestLead?.createdAt);

  const filterTabs = [
    { key: "ALL", label: "Tất cả", count: totalAll, href: "/admin/leads" },
    { key: "NEW", label: "Mới tiếp nhận", count: countMap["NEW"] || 0, href: "/admin/leads?status=NEW" },
    { key: "CONTACTED", label: "Đang tư vấn", count: countMap["CONTACTED"] || 0, href: "/admin/leads?status=CONTACTED" },
    { key: "QUOTED", label: "Đã gửi báo giá", count: countMap["QUOTED"] || 0, href: "/admin/leads?status=QUOTED" },
    { key: "CLOSED", label: "Đã chốt hợp đồng", count: countMap["CLOSED"] || 0, href: "/admin/leads?status=CLOSED" },
  ];

  return (
    <div className="p-6 sm:p-10 max-w-7xl mx-auto space-y-6 bg-slate-50 text-slate-900">
      {/* Tiêu đề & Công cụ xuất Excel / Dọn dẹp định kỳ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-azure-50 text-azure-700 border border-azure-200">
              Quản Lý Báo Giá
            </span>
            <span className="text-[11px] text-slate-500">
              Tổng cộng <strong className="font-mono tabular-nums text-slate-800">{totalAll}</strong> yêu cầu
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
            Danh Sách Báo Giá & Khách Hàng
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Theo dõi, xử lý, xuất dữ liệu và dọn dẹp định kỳ các yêu cầu báo giá từ khách hàng.
          </p>
        </div>

        {/* Nút Xuất Excel & Dọn Dẹp Định Kỳ */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <ExportLeadsButton currentStatus={currentStatus} totalCount={leads.length} />
          <CleanupLeadsModal
            totalLeads={totalAll}
            completedLeads={completedLeads}
            earliestDateStr={earliestDateStr}
            latestDateStr={latestDateStr}
          />
        </div>
      </div>

      {/* Bộ lọc phân loại trạng thái Báo Giá */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        {filterTabs.map((tab) => {
          const isActive = currentStatus === tab.key;
          return (
            <Link
              key={tab.key}
              href={tab.href}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-colors border ${
                isActive
                  ? "bg-azure-600 text-white border-azure-600 shadow-xs"
                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-950"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  isActive
                    ? "bg-white/20 text-white"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                {tab.count}
              </span>
            </Link>
          );
        })}
      </div>

      {/* Bảng Danh Sách Các Yêu Cầu Báo Giá */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {leads.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            Không có yêu cầu báo giá nào trong mục này.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {leads.map((lead) => {
              const dateStr = new Date(lead.createdAt).toLocaleString("vi-VN", {
                timeZone: "Asia/Ho_Chi_Minh",
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              });

              return (
                <div key={lead.id} className="p-6 hover:bg-slate-50/80 transition-colors">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Thông tin khách hàng & Yêu cầu */}
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="text-base font-bold text-slate-950">
                          {lead.fullName}
                        </span>
                        {lead.company && (
                          <span className="text-xs text-slate-600 font-medium flex items-center gap-1">
                            <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>{lead.company}</span>
                          </span>
                        )}
                        <span
                          className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                            lead.status === "NEW"
                              ? "bg-amber-100 text-amber-800 border border-amber-300"
                              : lead.status === "CONTACTED"
                              ? "bg-azure-100 text-azure-800 border border-azure-300"
                              : lead.status === "QUOTED"
                              ? "bg-indigo-100 text-indigo-800 border border-indigo-300"
                              : "bg-emerald-100 text-emerald-800 border border-emerald-300"
                          }`}
                        >
                          {lead.status === "NEW"
                            ? "Mới tiếp nhận"
                            : lead.status === "CONTACTED"
                            ? "Đang tư vấn"
                            : lead.status === "QUOTED"
                            ? "Đã gửi báo giá"
                            : "Đã chốt hợp đồng"}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                        <a
                          href={`tel:${lead.phone.replace(/[^0-9]/g, "")}`}
                          className="flex items-center gap-1.5 font-bold text-azure-700 hover:text-azure-900 hover:underline"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span className="font-mono tabular-nums">{lead.phone}</span>
                        </a>

                        {lead.email && (
                          <span className="flex items-center gap-1.5 text-slate-600 font-mono">
                            <Mail className="w-3.5 h-3.5" />
                            <span>{lead.email}</span>
                          </span>
                        )}

                        <span className="flex items-center gap-1.5 text-slate-500">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Gửi lúc: <strong className="font-mono tabular-nums text-slate-700">{dateStr}</strong></span>
                        </span>
                      </div>

                      {/* Chi tiết tuyến đường & lô hàng */}
                      <div className="pt-2 text-xs space-y-1">
                        <div>
                          <span className="font-semibold text-slate-500">Dịch vụ:</span>{" "}
                          <span className="text-azure-700 font-bold">{lead.serviceType}</span>
                        </div>
                        {(lead.routeOrigin || lead.routeDestination) && (
                          <div className="flex items-center gap-1 text-slate-700 text-[11px]">
                            <MapPin className="w-3.5 h-3.5 text-azure-600 shrink-0" />
                            <span>
                              {lead.routeOrigin || "Chưa rõ"} ➔ {lead.routeDestination || "Chưa rõ"}
                            </span>
                          </div>
                        )}
                        {lead.cargoDetails && (
                          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 mt-2 text-xs">
                            <strong className="text-slate-600">Chi tiết hàng hóa:</strong> {lead.cargoDetails}
                          </div>
                        )}
                        {lead.message && (
                          <div className="p-2.5 bg-slate-50/70 border border-slate-200/80 rounded-lg text-slate-700 text-[11px] mt-1">
                            <strong className="text-slate-600">Yêu cầu bổ sung:</strong> {lead.message}
                          </div>
                        )}
                        {lead.notes && (
                          <div className="text-[11px] text-amber-800 bg-amber-50 border border-amber-200 p-2 rounded-lg mt-1">
                            <strong>Ghi chú nội bộ:</strong> {lead.notes}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Cập nhật trạng thái nhanh */}
                    <div className="flex items-center gap-2 shrink-0 pt-2 lg:pt-0">
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
                          className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:border-azure-500 focus:outline-none"
                        >
                          <option value="NEW">Mới tiếp nhận</option>
                          <option value="CONTACTED">Đang tư vấn</option>
                          <option value="QUOTED">Đã gửi báo giá</option>
                          <option value="CLOSED">Đã chốt hợp đồng</option>
                        </select>
                        <button
                          type="submit"
                          className="px-3.5 py-1.5 bg-azure-600 hover:bg-azure-500 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
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
