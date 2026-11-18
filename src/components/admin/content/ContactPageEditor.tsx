"use client";

import React, { useState } from "react";
import { Plus, Trash2, Save, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { savePageSectionContent } from "@/modules/content/actions";
import { DEFAULT_CONTACT_CONTENT } from "@/modules/content/constants";

export function ContactPageEditor({ initialData }: { initialData?: any }) {
  const [data, setData] = useState<any>(initialData || DEFAULT_CONTACT_CONTENT);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  const handleSave = async () => {
    setSaving(true);
    setStatus(null);
    const res = await savePageSectionContent(
      "content_contact",
      data,
      "Cập nhật Thông Tin Liên Hệ & Chi Nhánh"
    );
    setSaving(false);
    if (res.success) {
      setStatus({ type: "success", msg: "Đã lưu thông tin liên hệ và các chi nhánh thành công!" });
    } else {
      setStatus({ type: "error", msg: res.message || "Có lỗi xảy ra khi lưu!" });
    }
    setTimeout(() => setStatus(null), 4000);
  };

  const addBranch = () => {
    setData((prev: any) => ({
      ...prev,
      branches: [
        ...(prev.branches || DEFAULT_CONTACT_CONTENT.branches),
        {
          name: "Chi Nhánh Cửa Khẩu Mới",
          address: "Địa chỉ văn phòng / bãi kiểm hóa hiện trường...",
          note: "Ghi chú hoạt động kiểm hóa và tiếp vận...",
        },
      ],
    }));
  };

  const removeBranch = (idx: number) => {
    setData((prev: any) => ({
      ...prev,
      branches: (prev.branches || DEFAULT_CONTACT_CONTENT.branches).filter((_: any, i: number) => i !== idx),
    }));
  };

  const updateBranch = (idx: number, field: string, value: string) => {
    setData((prev: any) => {
      const cur = [...(prev.branches || DEFAULT_CONTACT_CONTENT.branches)];
      cur[idx] = { ...cur[idx], [field]: value };
      return { ...prev, branches: cur };
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Trang Liên Hệ & Mạng Lưới Chi Nhánh</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Quản lý thông tin pháp lý doanh nghiệp, trụ sở chính và các điểm trực tại cửa khẩu / cảng biển.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-azure-600 hover:bg-azure-500 text-white font-bold text-xs transition-colors shadow-sm disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>{saving ? "Đang lưu..." : "Lưu Thay Đổi"}</span>
        </button>
      </div>

      {status && (
        <div
          className={`p-4 rounded-xl text-xs font-semibold flex items-center gap-2 border ${
            status.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : "bg-rose-50 text-rose-800 border-rose-200"
          }`}
        >
          {status.type === "success" ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          <span>{status.msg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cột trái: Thông tin pháp lý & Trụ sở chính */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-4 shadow-xs">
            <h3 className="font-bold text-sm text-slate-900 pb-2 border-b border-slate-100">
              Thông Tin Pháp Lý Doanh Nghiệp
            </h3>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Tên Doanh Nghiệp:</label>
              <input
                type="text"
                value={data.companyName || "CÔNG TY TNHH LOGISTICS GT"}
                onChange={(e) => setData({ ...data, companyName: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-bold focus:border-azure-500 focus:bg-white focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Mã Số Thuế (MST):</label>
                <input
                  type="text"
                  value={data.taxCode || "5702157588"}
                  onChange={(e) => setData({ ...data, taxCode: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-bold focus:border-azure-500 focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Đại Diện Pháp Luật:</label>
                <input
                  type="text"
                  value={data.legalRep || "Ông Ngô Thế Hải"}
                  onChange={(e) => setData({ ...data, legalRep: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-bold focus:border-azure-500 focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Hotline:</label>
                <input
                  type="text"
                  value={data.phone || "0904.382.268"}
                  onChange={(e) => setData({ ...data, phone: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-gold-600 text-sm font-bold focus:border-azure-500 focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Email:</label>
                <input
                  type="text"
                  value={data.email || "contact@logisticsgt.vn"}
                  onChange={(e) => setData({ ...data, email: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-medium focus:border-azure-500 focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Giờ Làm Việc:</label>
              <input
                type="text"
                value={data.workingHours || "Thứ Hai - Chủ Nhật (07:30 - 18:30)"}
                onChange={(e) => setData({ ...data, workingHours: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs focus:border-azure-500 focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          {/* Trụ Sở Chính */}
          <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-4 shadow-xs">
            <h3 className="font-bold text-sm text-slate-900 pb-2 border-b border-slate-100">
              Trụ Sở Chính
            </h3>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Tiêu Đề Trụ Sở:</label>
              <input
                type="text"
                value={data.headquarters?.title || "Trụ Sở Chính (Bắc Luân 2 - Móng Cái)"}
                onChange={(e) =>
                  setData({
                    ...data,
                    headquarters: {
                      ...(data.headquarters || DEFAULT_CONTACT_CONTENT.headquarters),
                      title: e.target.value,
                    },
                  })
                }
                className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-bold focus:border-azure-500 focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Địa Chỉ Chi Tiết:</label>
              <textarea
                rows={2}
                value={data.headquarters?.address || DEFAULT_CONTACT_CONTENT.headquarters.address}
                onChange={(e) =>
                  setData({
                    ...data,
                    headquarters: {
                      ...(data.headquarters || DEFAULT_CONTACT_CONTENT.headquarters),
                      address: e.target.value,
                    },
                  })
                }
                className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs leading-relaxed focus:border-azure-500 focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Ghi Chú Năng Lực:</label>
              <input
                type="text"
                value={data.headquarters?.note || DEFAULT_CONTACT_CONTENT.headquarters.note}
                onChange={(e) =>
                  setData({
                    ...data,
                    headquarters: {
                      ...(data.headquarters || DEFAULT_CONTACT_CONTENT.headquarters),
                      note: e.target.value,
                    },
                  })
                }
                className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-600 text-xs focus:border-azure-500 focus:bg-white focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Cột phải: Mạng lưới chi nhánh cửa khẩu */}
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <div>
              <h3 className="font-bold text-sm text-slate-900">Chi Nhánh Cửa Khẩu & Cảng Biển</h3>
              <p className="text-xs text-slate-500">Danh sách các điểm túc trực hiện trường giải phóng hàng.</p>
            </div>
            <button
              type="button"
              onClick={addBranch}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-azure-600 hover:bg-azure-500 text-white font-bold text-xs shadow-xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Thêm Chi Nhánh</span>
            </button>
          </div>

          <div className="space-y-4">
            {(data.branches || DEFAULT_CONTACT_CONTENT.branches).map((branch: any, idx: number) => (
              <div key={idx} className="group p-5 rounded-2xl bg-white border border-slate-200 space-y-3 relative shadow-xs">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-azure-700 text-xs">Chi nhánh #{idx + 1}</span>
                  <button
                    type="button"
                    onClick={() => removeBranch(idx)}
                    className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                    title="Xóa chi nhánh này"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">Tên chi nhánh:</label>
                  <input
                    type="text"
                    value={branch.name}
                    onChange={(e) => updateBranch(idx, "name", e.target.value)}
                    className="w-full p-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-xs font-bold focus:border-azure-500 focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">Địa chỉ văn phòng / bãi:</label>
                  <textarea
                    rows={2}
                    value={branch.address}
                    onChange={(e) => updateBranch(idx, "address", e.target.value)}
                    className="w-full p-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 text-xs focus:border-azure-500 focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">Ghi chú hoạt động:</label>
                  <input
                    type="text"
                    value={branch.note}
                    onChange={(e) => updateBranch(idx, "note", e.target.value)}
                    className="w-full p-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-500 text-[11px] focus:border-azure-500 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
