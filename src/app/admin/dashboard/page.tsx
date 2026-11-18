import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  FileText,
  Users,
  PhoneCall,
  Truck,
  Settings,
  PlusCircle,
  ArrowRight,
} from "lucide-react";
import { prisma } from "@/lib/db";
import { getCurrentAdmin } from "@/lib/auth";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export default async function AdminDashboardPage() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    redirect("/admin/login");
  }

  const [postCount, newLeadsCount, totalLeadsCount, servicesCount, recentLeads, recentPosts] =
    await Promise.all([
      prisma.post.count(),
      prisma.lead.count({ where: { status: "NEW" } }),
      prisma.lead.count(),
      prisma.service.count(),
      prisma.lead.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
      prisma.post.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
    ]);

  return (
    <div className="p-6 sm:p-10 max-w-7xl mx-auto space-y-8 bg-slate-50 text-slate-900">
      {/* Header Chào Mừng */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-azure-50 text-azure-700 border border-azure-200">
              Bảng Điều Khiển
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
            Xin Chào, {admin.fullName}!
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Tổng quan dữ liệu vận hành website và các yêu cầu báo giá từ khách hàng.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/admin/posts/new">
            <Button variant="accent" size="sm" className="font-bold tap-press shadow-md shadow-gold-500/10">
              <PlusCircle className="w-4 h-4 mr-1.5" />
              <span>Viết Bài Mới</span>
            </Button>
          </Link>
          <Link href="/admin/settings">
            <Button variant="outline" size="sm" className="font-semibold bg-white border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-slate-950 tap-press">
              <Settings className="w-4 h-4 mr-1.5 text-slate-500" />
              <span>Cấu Hình</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Thẻ Thống Kê Dữ Liệu Vận Hành Thực Tế */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4 hover:border-amber-400 transition-colors">
          <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center font-bold">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium block">
              Yêu cầu mới chờ xử lý
            </span>
            <span className="text-2xl font-black text-amber-600 mt-1 block font-mono tabular-nums">
              {newLeadsCount}
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4 hover:border-azure-400 transition-colors">
          <div className="w-12 h-12 rounded-xl bg-azure-50 border border-azure-200 text-azure-600 flex items-center justify-center font-bold">
            <PhoneCall className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium block">
              Tổng số khách hàng (Leads)
            </span>
            <span className="text-2xl font-black text-slate-950 mt-1 block font-mono tabular-nums">
              {totalLeadsCount}
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4 hover:border-indigo-400 transition-colors">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center font-bold">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium block">
              Bài viết tin tức & cẩm nang
            </span>
            <span className="text-2xl font-black text-slate-950 mt-1 block font-mono tabular-nums">
              {postCount}
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-4 hover:border-emerald-400 transition-colors">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center font-bold">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-500 font-medium block">
              Dịch vụ logistics chủ lực
            </span>
            <span className="text-2xl font-black text-slate-950 mt-1 block font-mono tabular-nums">
              {servicesCount}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Khách hàng mới gửi yêu cầu báo giá */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-base text-slate-950">
                Yêu Cầu Báo Giá & Liên Hệ Gần Nhất
              </h3>
              <p className="text-xs text-slate-500">Khách hàng điền thông tin từ website</p>
            </div>
            <Link
              href="/admin/leads"
              className="text-xs font-bold text-azure-700 hover:text-azure-900 flex items-center gap-1 transition-colors"
            >
              <span>Xem tất cả</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentLeads.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-400">
              Chưa có yêu cầu báo giá nào mới.
            </div>
          ) : (
            <div className="space-y-3">
              {recentLeads.map((lead) => (
                <div
                  key={lead.id}
                  className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-950 text-sm">
                        {lead.fullName}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          lead.status === "NEW"
                            ? "bg-amber-100 text-amber-800 border border-amber-300"
                            : "bg-emerald-100 text-emerald-800 border border-emerald-300"
                        }`}
                      >
                        {lead.status === "NEW" ? "Mới tiếp nhận" : "Đã liên hệ"}
                      </span>
                    </div>
                    <div className="text-slate-500 mt-1 flex flex-wrap gap-2 text-[11px]">
                      <span>SĐT: <strong className="text-slate-900 font-mono tabular-nums">{lead.phone}</strong></span>
                      <span>•</span>
                      <span>Dịch vụ: <strong className="text-slate-900">{lead.serviceType}</strong></span>
                    </div>
                    {lead.cargoDetails && (
                      <p className="text-slate-600 mt-1 italic line-clamp-1">
                        &quot;{lead.cargoDetails}&quot;
                      </p>
                    )}
                  </div>

                  <Link href="/admin/leads">
                    <Button variant="outline" size="sm" className="text-xs bg-white border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-slate-950 tap-press">
                      Xử Lý
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bài viết mới cập nhật */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-base text-slate-950">
                Bài Viết Vừa Đăng
              </h3>
              <p className="text-xs text-slate-500">Tin tức & cẩm nang XNK</p>
            </div>
            <Link
              href="/admin/posts"
              className="text-xs font-bold text-azure-700 hover:text-azure-900 flex items-center gap-1 transition-colors"
            >
              <span>Quản lý</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {recentPosts.map((post) => (
              <div
                key={post.id}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs"
              >
                <div className="pr-2">
                  <h4 className="font-bold text-slate-900 line-clamp-1">
                    {post.title}
                  </h4>
                  <div className="flex items-center gap-2 text-slate-500 text-[11px] mt-1">
                    <span>{post.category}</span>
                    <span>•</span>
                    <span>{new Date(post.createdAt).toLocaleDateString("vi-VN")}</span>
                  </div>
                </div>

                <Link
                  href={`/news/${post.slug}`}
                  target="_blank"
                  className="text-azure-700 hover:text-azure-900 shrink-0 font-bold"
                >
                  Xem
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
