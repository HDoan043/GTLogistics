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
    <div className="p-6 sm:p-10 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-brand-950 tracking-tight">
          Hộp Thư Khách Hàng Tiềm Năng (Leads & Báo Giá)
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Theo dõi và xử lý các yêu cầu báo giá cước, tư vấn hải quan từ khách hàng.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {leads.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            Chưa có yêu cầu báo giá nào từ khách hàng.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {leads.map((lead) => {
              const dateStr = new Date(lead.createdAt).toLocaleString("vi-VN", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              });

              return (
                <div key={lead.id} className="p-6 hover:bg-slate-50/50 transition-colors">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Thông tin khách hàng */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <span className="text-base font-bold text-slate-900">
                          {lead.fullName}
                        </span>
                        {lead.company && (
                          <span className="text-xs text-slate-500 flex items-center gap-1">
                            <Building className="w-3.5 h-3.5 text-slate-400" />
                            <span>{lead.company}</span>
                          </span>
                        )}
                        <Badge
                          variant={
                            lead.status === "NEW"
                              ? "accent"
                              : lead.status === "CONTACTED"
                              ? "warning"
                              : "success"
                          }
                        >
                          {lead.status === "NEW"
                            ? "Mới tiếp nhận"
                            : lead.status === "CONTACTED"
                            ? "Đang tư vấn"
                            : "Đã chốt"}
                        </Badge>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600">
                        <a
                          href={`tel:${lead.phone.replace(/[^0-9]/g, "")}`}
                          className="flex items-center gap-1.5 font-bold text-brand-700 hover:underline"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span>{lead.phone}</span>
                        </a>

                        {lead.email && (
                          <span className="flex items-center gap-1.5 text-slate-500">
                            <Mail className="w-3.5 h-3.5" />
                            <span>{lead.email}</span>
                          </span>
                        )}

                        <span className="flex items-center gap-1.5 text-slate-400">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Gửi lúc: {dateStr}</span>
                        </span>
                      </div>

                      {/* Chi tiết tuyến đường & lô hàng */}
                      <div className="pt-2 text-xs space-y-1">
                        <div>
                          <span className="font-semibold text-slate-700">Dịch vụ:</span>{" "}
                          <span className="text-brand-800 font-bold">{lead.serviceType}</span>
                        </div>
                        {(lead.routeOrigin || lead.routeDestination) && (
                          <div className="flex items-center gap-1 text-slate-600">
                            <MapPin className="w-3.5 h-3.5 text-accent-600 shrink-0" />
                            <span>
                              {lead.routeOrigin || "Chưa rõ"} ➔ {lead.routeDestination || "Chưa rõ"}
                            </span>
                          </div>
                        )}
                        {lead.cargoDetails && (
                          <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-slate-700 mt-2">
                            <strong>Chi tiết hàng hóa:</strong> {lead.cargoDetails}
                          </div>
                        )}
                        {lead.notes && (
                          <div className="text-[11px] text-amber-800 bg-amber-50 p-2 rounded-lg mt-1">
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
                          className="px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-700"
                        >
                          <option value="NEW">Mới tiếp nhận</option>
                          <option value="CONTACTED">Đang tư vấn</option>
                          <option value="QUOTED">Đã gửi báo giá</option>
                          <option value="CLOSED">Đã chốt hợp đồng</option>
                        </select>
                        <button
                          type="submit"
                          className="px-3 py-1.5 bg-brand-700 hover:bg-brand-800 text-white rounded-lg text-xs font-bold transition-colors"
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
