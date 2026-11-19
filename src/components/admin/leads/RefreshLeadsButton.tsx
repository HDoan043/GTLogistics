"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function RefreshLeadsButton() {
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      router.refresh();
      // Hiệu ứng xoay tối thiểu 600ms giúp người dùng xác nhận rõ dữ liệu vừa được làm mới
      await new Promise((res) => setTimeout(res, 600));
    } finally {
      setIsRefreshing(false);
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={handleRefresh}
      disabled={isRefreshing}
      title="Làm mới dữ liệu danh sách báo giá ngay lập tức"
      className="bg-white border-slate-200 text-slate-700 hover:text-azure-700 hover:bg-slate-50 font-bold text-xs gap-1.5 shadow-xs"
    >
      <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-azure-600" : ""}`} />
      <span>{isRefreshing ? "Đang tải lại…" : "Làm Mới"}</span>
    </Button>
  );
}
