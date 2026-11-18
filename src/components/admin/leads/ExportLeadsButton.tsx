"use client";

import React, { useState } from "react";
import { FileSpreadsheet, Loader2, Download, CheckCircle2 } from "lucide-react";

interface ExportLeadsButtonProps {
  currentStatus?: string;
  totalCount: number;
}

export function ExportLeadsButton({ currentStatus = "ALL", totalCount }: ExportLeadsButtonProps) {
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const handleExport = async (statusParam?: string) => {
    if (totalCount === 0) {
      alert("Chưa có dữ liệu báo giá nào để xuất file!");
      return;
    }

    try {
      setDownloading(true);
      const targetStatus = statusParam || currentStatus || "ALL";
      const url = `/api/admin/leads/export?status=${encodeURIComponent(targetStatus)}`;

      // Tải file trực tiếp thông qua trình duyệt
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Không thể xuất file. Vui lòng kiểm tra quyền quản trị!");
      }

      const blob = await response.blob();
      const disposition = response.headers.get("Content-Disposition");
      let filename = "Danh_Sach_Bao_Gia_GT_Logistics.xlsx";
      if (disposition && disposition.includes("filename=")) {
        const match = disposition.match(/filename="?([^"]+)"?/);
        if (match && match[1]) {
          filename = match[1];
        }
      }

      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);

      setDownloaded(true);
      setTimeout(() => setDownloaded(false), 3000);
    } catch (err: any) {
      alert(err.message || "Có lỗi xảy ra khi tải file Excel!");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => handleExport(currentStatus)}
        disabled={downloading || totalCount === 0}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm hover:shadow transition-colors whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        title="Tải về file Excel chứa đầy đủ thông tin báo giá và chi tiết lô hàng"
      >
        {downloading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin text-white" />
            <span>Đang xuất Excel…</span>
          </>
        ) : downloaded ? (
          <>
            <CheckCircle2 className="w-4 h-4 text-emerald-200" />
            <span>Đã tải xong!</span>
          </>
        ) : (
          <>
            <FileSpreadsheet className="w-4 h-4 text-emerald-100" />
            <span>Xuất Excel (.xlsx)</span>
          </>
        )}
      </button>
    </div>
  );
}
