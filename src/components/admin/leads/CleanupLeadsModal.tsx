"use client";

import React, { useState } from "react";
import { Trash2, AlertTriangle, Download, X, Loader2, CheckCircle2, ShieldAlert } from "lucide-react";

interface CleanupLeadsModalProps {
  totalLeads: number;
  completedLeads: number;
  earliestDateStr?: string;
  latestDateStr?: string;
}

export function CleanupLeadsModal({
  totalLeads,
  completedLeads,
  earliestDateStr,
  latestDateStr,
}: CleanupLeadsModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scope, setScope] = useState<"ALL" | "PROCESSED">("ALL");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [deletedCount, setDeletedCount] = useState<number | null>(null);

  const previewDateRange =
    earliestDateStr && latestDateStr
      ? earliestDateStr === latestDateStr
        ? `Ngay_${earliestDateStr}`
        : `Tu_${earliestDateStr}_Den_${latestDateStr}`
      : "Toan_Bo_Lich_Su";

  const previewFilename = `Sao_Luu_Bao_Gia_GT_Logistics_${previewDateRange}.xlsx`;

  const handleConfirmCleanup = async () => {
    try {
      setIsProcessing(true);

      const response = await fetch("/api/admin/leads/cleanup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ scope }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Có lỗi xảy ra khi dọn dẹp dữ liệu.");
      }

      // Nhận file Excel sao lưu từ máy chủ và kích hoạt tải xuống
      const blob = await response.blob();
      const disposition = response.headers.get("Content-Disposition");
      let downloadFilename = previewFilename;

      if (disposition && disposition.includes("filename=")) {
        const match = disposition.match(/filename="?([^";]+)"?/);
        if (match && match[1]) {
          downloadFilename = decodeURIComponent(match[1]);
        }
      }

      const countHeader = response.headers.get("X-Deleted-Count");
      const count = countHeader ? parseInt(countHeader, 10) : totalLeads;
      setDeletedCount(count);

      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = downloadFilename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);

      setIsSuccess(true);

      // Tự động tải lại trang sau 2.5 giây để cập nhật lại danh sách mới
      setTimeout(() => {
        window.location.reload();
      }, 2500);
    } catch (err: any) {
      alert(err.message || "Không thể hoàn thành dọn dẹp.");
      setIsProcessing(false);
    }
  };

  return (
    <>
      {/* Nút mở Modal Dọn dẹp định kỳ */}
      <button
        type="button"
        onClick={() => {
          if (totalLeads === 0) {
            alert("Hiện không có dữ liệu báo giá nào trên máy chủ để dọn dẹp!");
            return;
          }
          setIsOpen(true);
          setIsSuccess(false);
        }}
        disabled={totalLeads === 0}
        className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition-colors whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-xs"
        title="Dọn dẹp định kỳ: Tự động tải file Excel sao lưu về máy và giải phóng bộ nhớ máy chủ"
      >
        <Trash2 className="w-3.5 h-3.5 text-rose-600 shrink-0" />
        <span>Dọn Dẹp Định Kỳ</span>
      </button>

      {/* Màn hình thông báo & Xác nhận Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70">
          <div className="w-full max-w-lg bg-white rounded-3xl border border-slate-200 text-slate-900 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Header Modal */}
            <div className="p-6 bg-rose-50/70 border-b border-rose-100 flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-rose-100 border border-rose-300 text-rose-700 flex items-center justify-center shrink-0 shadow-xs">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-slate-950 text-base sm:text-lg tracking-tight">
                    Dọn Dẹp & Sao Lưu Dữ Liệu
                  </h3>
                  <p className="text-xs text-rose-700 font-medium mt-0.5">
                    Giải phóng dung lượng máy chủ kèm tải file Excel sao lưu an toàn
                  </p>
                </div>
              </div>

              {!isProcessing && (
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="w-8 h-8 rounded-xl bg-white/80 hover:bg-white text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors border border-slate-200 shrink-0 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Nội dung Modal */}
            <div className="p-6 space-y-4">
              {isSuccess ? (
                <div className="py-6 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-bold text-slate-950">
                    Dọn Dẹp Thành Công!
                  </h4>
                  <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                    Đã tải file Excel sao lưu về máy tính của bạn và giải phóng thành công{" "}
                    <strong className="text-slate-900 font-bold">{deletedCount}</strong> bản ghi khỏi máy chủ.
                  </p>
                  <span className="inline-block text-[11px] text-azure-700 font-semibold animate-pulse">
                    Đang làm mới lại danh sách trang…
                  </span>
                </div>
              ) : (
                <>
                  {/* Khối cảnh báo đỏ nổi bật */}
                  <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-900 text-xs leading-relaxed space-y-1.5">
                    <div className="flex items-center gap-2 font-bold text-amber-950">
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>Thông báo quan trọng trước khi dọn dẹp:</span>
                    </div>
                    <ul className="list-disc list-inside space-y-1 pl-1 text-[11px] text-amber-800">
                      <li>
                        Toàn bộ dữ liệu báo giá trong phạm vi lựa chọn sẽ <strong>bị xóa vĩnh viễn khỏi máy chủ</strong> để giải phóng bộ nhớ.
                      </li>
                      <li>
                        Hệ thống sẽ <strong>tự động tải xuống máy tính của bạn 1 file Excel (.xlsx)</strong> lưu trữ toàn bộ lịch sử các báo giá được dọn dẹp trước khi thực hiện xóa.
                      </li>
                    </ul>
                  </div>

                  {/* Lựa chọn phạm vi dọn dẹp */}
                  <div className="space-y-2 pt-1">
                    <label className="text-xs font-bold text-slate-700 block">
                      Chọn phạm vi dọn dẹp:
                    </label>

                    <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:border-azure-400 bg-slate-50/60 cursor-pointer transition-colors">
                      <input
                        type="radio"
                        name="cleanup_scope"
                        checked={scope === "ALL"}
                        onChange={() => setScope("ALL")}
                        disabled={isProcessing}
                        className="w-4 h-4 text-azure-600"
                      />
                      <div className="text-xs">
                        <span className="font-bold text-slate-900 block">
                          Toàn bộ tất cả báo giá ({totalLeads} yêu cầu)
                        </span>
                        <span className="text-[11px] text-slate-500">
                          Sao lưu và dọn sạch toàn bộ dữ liệu báo giá hiện có.
                        </span>
                      </div>
                    </label>

                    {completedLeads > 0 && (
                      <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:border-azure-400 bg-slate-50/60 cursor-pointer transition-colors">
                        <input
                          type="radio"
                          name="cleanup_scope"
                          checked={scope === "PROCESSED"}
                          onChange={() => setScope("PROCESSED")}
                          disabled={isProcessing}
                          className="w-4 h-4 text-azure-600"
                        />
                        <div className="text-xs">
                          <span className="font-bold text-slate-900 block">
                            Chỉ các báo giá đã xử lý xong ({completedLeads} yêu cầu)
                          </span>
                          <span className="text-[11px] text-slate-500">
                            Giữ lại các yêu cầu mới tiếp nhận hoặc đang tư vấn.
                          </span>
                        </div>
                      </label>
                    )}
                  </div>

                  {/* Xem trước tên file sao lưu */}
                  <div className="p-3 bg-slate-100 rounded-xl text-[11px] space-y-1">
                    <span className="text-slate-500 font-semibold block">
                      Tên file sao lưu sẽ tự động tải về:
                    </span>
                    <span className="font-mono font-bold text-azure-700 block break-all">
                      {previewFilename}
                    </span>
                  </div>
                </>
              )}
            </div>

            {/* Footer Modal Actions */}
            {!isSuccess && (
              <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  disabled={isProcessing}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-200 text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50"
                >
                  Hủy Bỏ
                </button>

                <button
                  type="button"
                  onClick={handleConfirmCleanup}
                  disabled={isProcessing}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors shadow-sm disabled:opacity-50 cursor-pointer whitespace-nowrap"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Đang tạo sao lưu & dọn dẹp…</span>
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 text-rose-100" />
                      <span>Tải Sao Lưu & Dọn Dẹp Ngay</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
