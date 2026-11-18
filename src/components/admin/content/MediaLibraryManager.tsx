"use client";

import React, { useState, useEffect } from "react";
import { Upload, RefreshCw, Copy, Check, Loader2, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

export function MediaLibraryManager() {
  const [images, setImages] = useState<{ url: string; name: string; size?: number }[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const fetchImages = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/upload");
      const data = await res.json();
      if (data.success && Array.isArray(data.images)) {
        setImages(data.images);
      }
    } catch {
      setMessage({ type: "error", text: "Không thể tải thư viện ảnh từ server." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setMessage(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (data.success) {
        setMessage({ type: "success", text: "Tải ảnh lên thành công!" });
        fetchImages();
      } else {
        setMessage({ type: "error", text: data.error || "Lỗi khi tải ảnh." });
      }
    } catch {
      setMessage({ type: "error", text: "Lỗi kết nối máy chủ." });
    } finally {
      setUploading(false);
    }
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-azure-600" />
            <span>Thư Viện Ảnh (Media Library)</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Quản lý và tải ảnh trực tiếp lên ổ cứng máy chủ VPS. Sao chép nhanh đường dẫn để sử dụng.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 px-4 py-2 bg-azure-600 hover:bg-azure-500 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-xs">
            {uploading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Upload className="w-4 h-4" />
            )}
            <span>{uploading ? "Đang tải ảnh..." : "Tải Ảnh Mới Lên VPS"}</span>
            <input
              type="file"
              accept="image/*"
              disabled={uploading}
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>

          <button
            type="button"
            onClick={fetchImages}
            disabled={loading}
            className="p-2 bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 rounded-xl transition-colors"
            title="Làm mới danh sách"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {message && (
        <div
          className={`p-4 rounded-xl text-xs font-semibold border ${
            message.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : "bg-rose-50 text-rose-800 border-rose-200"
          }`}
        >
          {message.text}
        </div>
      )}

      {loading ? (
        <div className="py-20 text-center text-slate-500 text-xs flex flex-col items-center gap-2">
          <Loader2 className="w-8 h-8 animate-spin text-azure-600" />
          <span>Đang tải danh sách thư viện ảnh...</span>
        </div>
      ) : images.length === 0 ? (
        <div className="py-20 text-center text-slate-500 text-xs">
          Chưa có hình ảnh nào được tải lên VPS.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {images.map((img) => {
            const isCopied = copiedUrl === img.url;
            return (
              <div
                key={img.url}
                className="group relative rounded-xl overflow-hidden bg-white border border-slate-200 hover:border-azure-400 transition-colors flex flex-col shadow-xs"
              >
                <div className="relative aspect-video w-full bg-slate-100">
                  <Image
                    src={img.url}
                    alt={img.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-200"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                </div>

                <div className="p-2.5 flex items-center justify-between gap-2 border-t border-slate-100 bg-slate-50">
                  <span className="text-[11px] text-slate-700 truncate font-mono block">
                    {img.name}
                  </span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(img.url)}
                    className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-azure-50 text-slate-600 hover:text-azure-700 transition-colors shrink-0"
                    title="Sao chép đường dẫn URL"
                  >
                    {isCopied ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
