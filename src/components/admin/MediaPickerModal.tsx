"use client";

import React, { useState, useEffect } from "react";
import { Upload, Image as ImageIcon, X, Check, Loader2, RefreshCw } from "lucide-react";
import Image from "next/image";

interface MediaPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
  currentImage?: string;
  title?: string;
}

export function MediaPickerModal({
  isOpen,
  onClose,
  onSelect,
  currentImage,
  title = "Chọn hoặc tải ảnh lên",
}: MediaPickerModalProps) {
  const [activeTab, setActiveTab] = useState<"library" | "upload" | "url">("library");
  const [images, setImages] = useState<{ url: string; name: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedUrl, setSelectedUrl] = useState(currentImage || "");
  const [manualUrl, setManualUrl] = useState(currentImage || "");
  const [error, setError] = useState<string | null>(null);

  // Tải danh sách ảnh từ server
  const fetchLibrary = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/upload");
      const data = await res.json();
      if (data.success && Array.isArray(data.images)) {
        setImages(data.images);
      }
    } catch {
      setError("Không thể tải thư viện ảnh.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setSelectedUrl(currentImage || "");
      setManualUrl(currentImage || "");
      fetchLibrary();
    }
  }, [isOpen, currentImage]);

  // Xử lý upload file mới
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (data.success && data.url) {
        setSelectedUrl(data.url);
        onSelect(data.url);
        onClose();
      } else {
        setError(data.error || "Lỗi tải ảnh.");
      }
    } catch {
      setError("Lỗi kết nối khi tải ảnh.");
    } finally {
      setUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-azure-400" />
            <h3 className="font-bold text-white text-sm sm:text-base">{title}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab navigation */}
        <div className="flex border-b border-slate-800 bg-slate-950/60 px-4 pt-2 gap-2 text-xs font-semibold">
          <button
            onClick={() => setActiveTab("library")}
            className={`px-4 py-2 border-b-2 transition-colors ${
              activeTab === "library"
                ? "border-azure-500 text-azure-400 font-bold"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            Thư Viện Ảnh Có Sẵn ({images.length})
          </button>
          <button
            onClick={() => setActiveTab("upload")}
            className={`px-4 py-2 border-b-2 transition-colors ${
              activeTab === "upload"
                ? "border-azure-500 text-azure-400 font-bold"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            Tải Ảnh Mới Từ Máy
          </button>
          <button
            onClick={() => setActiveTab("url")}
            className={`px-4 py-2 border-b-2 transition-colors ${
              activeTab === "url"
                ? "border-azure-500 text-azure-400 font-bold"
                : "border-transparent text-slate-400 hover:text-slate-200"
            }`}
          >
            Nhập Đường Link Ảnh (URL)
          </button>
        </div>

        {/* Body content */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 text-slate-200">
          {error && (
            <div className="mb-4 p-3 bg-rose-950/80 border border-rose-800 text-rose-300 rounded-xl text-xs font-semibold">
              {error}
            </div>
          )}

          {activeTab === "library" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Nhấp vào ảnh để chọn:</span>
                <button
                  onClick={fetchLibrary}
                  className="flex items-center gap-1 hover:text-azure-400 transition-colors"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
                  <span>Làm mới</span>
                </button>
              </div>

              {loading ? (
                <div className="py-16 text-center text-slate-400 text-xs flex flex-col items-center gap-2">
                  <Loader2 className="w-6 h-6 animate-spin text-azure-400" />
                  <span>Đang tải danh sách ảnh...</span>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-h-[45vh] overflow-y-auto pr-1">
                  {images.map((img) => {
                    const isSelected = selectedUrl === img.url;
                    return (
                      <div
                        key={img.url}
                        onClick={() => setSelectedUrl(img.url)}
                        className={`group relative aspect-video rounded-xl overflow-hidden border-2 cursor-pointer transition-colors ${
                          isSelected
                            ? "border-azure-500 ring-2 ring-azure-500/30"
                            : "border-slate-800 hover:border-slate-600"
                        }`}
                      >
                        <Image
                          src={img.url}
                          alt={img.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-200"
                          sizes="(max-width: 768px) 50vw, 25vw"
                        />
                        {isSelected && (
                          <div className="absolute inset-0 bg-azure-950/40 flex items-center justify-center">
                            <span className="w-7 h-7 rounded-full bg-azure-500 text-white flex items-center justify-center shadow-lg">
                              <Check className="w-4 h-4" />
                            </span>
                          </div>
                        )}
                        <span className="absolute bottom-0 inset-x-0 bg-slate-950/80 px-2 py-1 text-[10px] text-slate-300 truncate">
                          {img.name}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === "upload" && (
            <div className="py-8 flex flex-col items-center justify-center border-2 border-dashed border-slate-700 rounded-2xl bg-slate-950/40 hover:border-azure-500/60 transition-colors p-6 text-center">
              {uploading ? (
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="w-8 h-8 animate-spin text-azure-400" />
                  <span className="text-sm font-semibold text-slate-300">
                    Đang tải và xử lý ảnh lên VPS...
                  </span>
                </div>
              ) : (
                <label className="cursor-pointer flex flex-col items-center gap-3 w-full">
                  <div className="w-14 h-14 rounded-2xl bg-azure-950/80 border border-azure-800 text-azure-400 flex items-center justify-center shadow-lg">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-white block">
                      Bấm vào đây để chọn ảnh từ máy tính / điện thoại
                    </span>
                    <span className="text-xs text-slate-400 mt-1 block">
                      Hỗ trợ định dạng PNG, JPG, JPEG, WEBP (Tối đa 15MB)
                    </span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          )}

          {activeTab === "url" && (
            <div className="space-y-4 py-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Đường dẫn ảnh (URL)
                </label>
                <input
                  type="text"
                  value={manualUrl}
                  onChange={(e) => {
                    setManualUrl(e.target.value);
                    setSelectedUrl(e.target.value);
                  }}
                  placeholder="https://example.com/banner.webp hoặc /images/..."
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white font-mono placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-azure-500"
                />
              </div>

              {manualUrl && (
                <div>
                  <span className="text-xs text-slate-400 block mb-1.5">Xem trước ảnh:</span>
                  <div className="relative aspect-video w-full max-w-sm rounded-xl overflow-hidden border border-slate-700">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={manualUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={() => setError("Đường link ảnh không hợp lệ hoặc không tải được.")}
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer controls */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between gap-3">
          <div className="text-xs text-slate-400 truncate max-w-sm">
            {selectedUrl ? (
              <span className="truncate block font-mono text-[11px]">Đã chọn: {selectedUrl}</span>
            ) : (
              <span>Chưa chọn ảnh nào</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800 transition-colors"
            >
              Hủy
            </button>
            <button
              onClick={() => {
                if (selectedUrl) {
                  onSelect(selectedUrl);
                  onClose();
                }
              }}
              disabled={!selectedUrl}
              className="px-5 py-2 rounded-xl text-xs font-bold bg-azure-600 hover:bg-azure-500 text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md"
            >
              Xác Nhận Chọn Ảnh
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
