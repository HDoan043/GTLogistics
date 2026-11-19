"use client";

import React, { useState, useTransition, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  HardDrive,
  Image as ImageIcon,
  FileText,
  UploadCloud,
  Trash2,
  Copy,
  Check,
  ExternalLink,
  Edit,
  PlusCircle,
  AlertTriangle,
  CheckCircle2,
  Filter,
  Calendar,
  Search,
  RefreshCw,
  X,
  Eye,
  ShieldAlert,
  FolderOpen,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { deletePost } from "@/modules/posts/actions";
import type { StorageStats } from "@/lib/storage";

export interface MediaItem {
  url: string;
  name: string;
  size?: number;
  createdAt?: string;
  folder: "uploads" | "vietphuc" | string;
}

export interface PostItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  coverImage: string;
  isPublished: boolean;
  viewCount: number;
  createdAt: string | Date;
}

interface MediaStorageManagerProps {
  initialStorage: StorageStats;
  initialImages: MediaItem[];
  initialPosts: PostItem[];
}

export function MediaStorageManager({
  initialStorage,
  initialImages,
  initialPosts,
}: MediaStorageManagerProps) {
  // State quản lý tab
  const [activeTab, setActiveTab] = useState<"media" | "posts">("media");

  // State dữ liệu
  const [storage, setStorage] = useState<StorageStats>(initialStorage);
  const [images, setImages] = useState<MediaItem[]>(initialImages);
  const [posts, setPosts] = useState<PostItem[]>(initialPosts);

  // State bộ lọc Media
  const [mediaFolderFilter, setMediaFolderFilter] = useState<string>("all");
  const [mediaTimeFilter, setMediaTimeFilter] = useState<string>("all");
  const [mediaSearch, setMediaSearch] = useState<string>("");
  const [mediaSort, setMediaSort] = useState<string>("newest");

  // State bộ lọc Posts
  const [postCategoryFilter, setPostCategoryFilter] = useState<string>("all");
  const [postStatusFilter, setPostStatusFilter] = useState<string>("all");
  const [postTimeFilter, setPostTimeFilter] = useState<string>("all");
  const [postSearch, setPostSearch] = useState<string>("");

  // State UI
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  // Modal xem trước ảnh
  const [previewImage, setPreviewImage] = useState<MediaItem | null>(null);

  // Modal xác nhận xóa ảnh
  const [deleteCandidate, setDeleteCandidate] = useState<MediaItem | null>(null);
  const [isDeletingMedia, setIsDeletingMedia] = useState(false);
  const [deleteMediaError, setDeleteMediaError] = useState<string | null>(null);

  // Modal xác nhận xóa bài viết
  const [postToDelete, setPostToDelete] = useState<PostItem | null>(null);
  const [isDeletingPost, startDeletePostTransition] = useTransition();
  const [deletePostError, setDeletePostError] = useState<string | null>(null);

  // Hàm tải mới dữ liệu từ server
  const handleRefresh = async () => {
    setIsRefreshing(true);
    setUploadError(null);
    setUploadSuccess(null);
    try {
      const res = await fetch("/api/upload");
      const data = await res.json();
      if (data.success) {
        if (Array.isArray(data.images)) {
          setImages(data.images);
        }
        if (data.storage) {
          setStorage(data.storage);
        }
      }
    } catch {
      // Bỏ qua lỗi kết nối tạm thời
    } finally {
      setIsRefreshing(false);
    }
  };

  // Sao chép liên kết vào Clipboard
  const handleCopy = (url: string) => {
    const fullUrl = url.startsWith("http") ? url : `${window.location.origin}${url}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedUrl(url);
    setTimeout(() => {
      setCopiedUrl(null);
    }, 2500);
  };

  // Xử lý upload ảnh mới
  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];

    // Kiểm tra định dạng
    if (!file.type.match(/^image\/(jpeg|png|webp|gif|svg\+xml)$/i)) {
      setUploadError("Chỉ chấp nhận file định dạng ảnh (JPG, PNG, WebP, GIF, SVG).");
      return;
    }

    // Kiểm tra dung lượng file (tối đa 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("Kích thước file ảnh vượt quá giới hạn 5MB.");
      return;
    }

    // Kiểm tra dung lượng máy chủ trước khi gửi
    if (storage.usedBytes + file.size > storage.maxBytes) {
      setUploadError(
        `Dung lượng máy chủ sắp vượt mức cho phép (${storage.usedFormatted} / ${storage.maxFormatted}). Vui lòng xóa bớt ảnh cũ để giải phóng bộ nhớ.`
      );
      return;
    }

    setIsUploading(true);
    setUploadError(null);
    setUploadSuccess(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (data.success && data.url) {
        setUploadSuccess(`Tải lên thành công: ${file.name}`);
        // Cập nhật danh sách ảnh
        setImages((prev) => [
          {
            url: data.url,
            name: file.name,
            size: file.size,
            createdAt: new Date().toISOString(),
            folder: "uploads",
          },
          ...prev,
        ]);
        if (data.storage) {
          setStorage(data.storage);
        } else {
          // Tính sơ bộ dung lượng
          setStorage((prev) => ({
            ...prev,
            usedBytes: prev.usedBytes + file.size,
            percent: Math.min(100, Math.round(((prev.usedBytes + file.size) / prev.maxBytes) * 100)),
            fileCount: prev.fileCount + 1,
          }));
        }
      } else {
        setUploadError(data.error || "Không thể tải file lên máy chủ.");
      }
    } catch {
      setUploadError("Lỗi kết nối trong quá trình tải ảnh.");
    } finally {
      setIsUploading(false);
    }
  };

  // Xác nhận xóa ảnh
  const handleConfirmDeleteMedia = async () => {
    if (!deleteCandidate) return;

    setIsDeletingMedia(true);
    setDeleteMediaError(null);

    try {
      const res = await fetch("/api/upload", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: deleteCandidate.url }),
      });
      const data = await res.json();

      if (data.success) {
        // Loại bỏ ảnh khỏi danh sách
        setImages((prev) => prev.filter((img) => img.url !== deleteCandidate.url));
        if (data.storage) {
          setStorage(data.storage);
        }
        setDeleteCandidate(null);
        setUploadSuccess("Đã xóa ảnh vĩnh viễn và giải phóng dung lượng máy chủ!");
      } else {
        setDeleteMediaError(data.error || "Không thể xóa ảnh.");
      }
    } catch {
      setDeleteMediaError("Lỗi kết nối khi gửi yêu cầu xóa ảnh.");
    } finally {
      setIsDeletingMedia(false);
    }
  };

  // Xác nhận xóa bài viết
  const handleConfirmDeletePost = () => {
    if (!postToDelete) return;

    startDeletePostTransition(async () => {
      try {
        const res = await deletePost(postToDelete.id);
        if (res.success) {
          setPosts((prev) => prev.filter((p) => p.id !== postToDelete.id));
          setPostToDelete(null);
          setUploadSuccess("Đã xóa bài viết thành công!");
        } else {
          setDeletePostError(res.message || "Không thể xóa bài viết.");
        }
      } catch {
        setDeletePostError("Lỗi kết nối khi thực hiện xóa bài viết.");
      }
    });
  };

  // Format kích thước file hiển thị
  const formatFileSize = (bytes?: number) => {
    if (!bytes || bytes === 0) return "N/A";
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  // Lọc danh sách ảnh
  const filteredImages = useMemo(() => {
    const now = new Date().getTime();
    return images
      .filter((img) => {
        // Lọc thư mục
        if (mediaFolderFilter === "uploads" && img.folder !== "uploads") return false;
        if (mediaFolderFilter === "vietphuc" && img.folder !== "vietphuc") return false;

        // Lọc từ khóa tìm kiếm
        if (mediaSearch.trim()) {
          const query = mediaSearch.toLowerCase().trim();
          if (!img.name.toLowerCase().includes(query) && !img.url.toLowerCase().includes(query)) {
            return false;
          }
        }

        // Lọc thời gian
        if (mediaTimeFilter !== "all" && img.createdAt) {
          const createdTime = new Date(img.createdAt).getTime();
          const diffDays = (now - createdTime) / (1000 * 60 * 60 * 24);
          if (mediaTimeFilter === "7days" && diffDays > 7) return false;
          if (mediaTimeFilter === "30days" && diffDays > 30) return false;
          if (mediaTimeFilter === "older" && diffDays <= 30) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (mediaSort === "size_desc") return (b.size || 0) - (a.size || 0);
        if (mediaSort === "size_asc") return (a.size || 0) - (b.size || 0);
        if (mediaSort === "oldest") {
          return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
        }
        // newest
        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      });
  }, [images, mediaFolderFilter, mediaTimeFilter, mediaSearch, mediaSort]);

  // Danh sách chuyên mục bài viết duy nhất
  const postCategories = useMemo(() => {
    const set = new Set<string>();
    posts.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return Array.from(set);
  }, [posts]);

  // Lọc danh sách bài viết
  const filteredPosts = useMemo(() => {
    const now = new Date().getTime();
    return posts.filter((p) => {
      // Chuyên mục
      if (postCategoryFilter !== "all" && p.category !== postCategoryFilter) return false;

      // Trạng thái
      if (postStatusFilter === "published" && !p.isPublished) return false;
      if (postStatusFilter === "draft" && p.isPublished) return false;

      // Tìm kiếm
      if (postSearch.trim()) {
        const q = postSearch.toLowerCase().trim();
        if (
          !p.title.toLowerCase().includes(q) &&
          !p.excerpt.toLowerCase().includes(q) &&
          !p.slug.toLowerCase().includes(q)
        ) {
          return false;
        }
      }

      // Thời gian
      if (postTimeFilter !== "all") {
        const createdTime = new Date(p.createdAt).getTime();
        const diffDays = (now - createdTime) / (1000 * 60 * 60 * 24);
        if (postTimeFilter === "7days" && diffDays > 7) return false;
        if (postTimeFilter === "30days" && diffDays > 30) return false;
      }

      return true;
    });
  }, [posts, postCategoryFilter, postStatusFilter, postSearch, postTimeFilter]);

  // Màu sắc thanh tiến trình dung lượng
  const getStorageColorClasses = () => {
    if (storage.percent >= 95) {
      return {
        bar: "bg-rose-500",
        badge: "bg-rose-100 text-rose-800 border-rose-300",
        text: "text-rose-600",
      };
    }
    if (storage.percent >= 80) {
      return {
        bar: "bg-amber-500",
        badge: "bg-amber-100 text-amber-800 border-amber-300",
        text: "text-amber-600",
      };
    }
    return {
      bar: "bg-azure-600",
      badge: "bg-azure-50 text-azure-700 border-azure-200",
      text: "text-azure-600",
    };
  };

  const storageColors = getStorageColorClasses();

  return (
    <div className="p-6 sm:p-10 max-w-7xl mx-auto space-y-8 bg-slate-50 text-slate-900">
      {/* Tiêu đề & Nút làm mới */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-azure-50 text-azure-700 border border-azure-200">
              Storage & Assets Hub
            </span>
            <span className="text-[11px] text-slate-500">
              Hạn mức tối đa: <strong className="font-mono">{storage.maxFormatted}</strong>
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
            Kho Lưu Trữ Tệp & Bài Viết
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
            Giám sát dung lượng lưu trữ máy chủ, dọn dẹp giải phóng hình ảnh và quản trị kho dữ liệu bài viết tập trung.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="text-xs font-semibold tap-press border-slate-300 bg-white hover:bg-slate-100"
          >
            <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${isRefreshing ? "animate-spin text-azure-600" : "text-slate-600"}`} />
            <span className="whitespace-nowrap">Làm Mới</span>
          </Button>

          <Link href="/admin/posts/new">
            <Button variant="accent" size="sm" className="text-xs font-bold tap-press shadow-xs">
              <PlusCircle className="w-3.5 h-3.5 mr-1.5" />
              <span className="whitespace-nowrap">Viết Bài Mới</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* THÔNG BÁO DUNG LƯỢNG MÁY CHỦ & CẢNH BÁO BỘ NHỚ */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-slate-100 rounded-xl text-slate-700">
              <HardDrive className="w-5 h-5 text-azure-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-bold text-slate-900">
                  Hạn Mức Bộ Nhớ Lưu Trữ Máy Chủ
                </h2>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${storageColors.badge}`}>
                  {storage.percent}% đã dùng
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Đã sử dụng <strong className="text-slate-800 font-mono">{storage.usedFormatted}</strong> trên tổng số{" "}
                <strong className="text-slate-800 font-mono">{storage.maxFormatted}</strong> cho phép.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-600 bg-slate-50 px-4 py-2 rounded-xl border border-slate-200">
            <div>
              <span className="text-slate-500 block text-[11px] font-semibold">Tệp ảnh</span>
              <strong className="text-slate-800 text-sm font-mono">{storage.fileCount}</strong> ảnh tải lên
            </div>
            <div className="h-6 w-px bg-slate-200" />
            <div>
              <span className="text-slate-500 block text-[11px] font-semibold">Bài viết</span>
              <strong className="text-slate-800 text-sm font-mono">{posts.length}</strong> bài đăng
            </div>
          </div>
        </div>

        {/* Thanh Gauge Bar tiến độ dung lượng */}
        <div className="space-y-1.5">
          <div className="w-full bg-slate-100 rounded-full h-3.5 overflow-hidden p-0.5 border border-slate-200">
            <div
              className={`h-full rounded-full transition-colors duration-500 ${storageColors.bar}`}
              style={{ width: `${Math.max(3, storage.percent)}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-[11px] text-slate-400 font-mono">
            <span>0 MB (Trống)</span>
            <span className="font-bold text-slate-700">80% (Ngưỡng cảnh báo)</span>
            <span>{storage.maxFormatted} (Giới hạn tối đa)</span>
          </div>
        </div>

        {/* CẢNH BÁO NGUY HIỂM / CẢNH BÁO CHẠM NGƯỠNG */}
        {storage.percent >= 95 && (
          <div className="flex items-start gap-3 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm animate-pulse">
            <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold block text-rose-900 text-sm">
                BÁO ĐỘNG KHẨN CẤP: DUNG LƯỢNG SERVER GẦN CHẠM NGƯỠNG TỐI ĐA (95%+)!
              </strong>
              <p className="mt-1 leading-relaxed">
                Máy chủ sắp cạn kiệt bộ nhớ cho phép ({storage.usedFormatted} / {storage.maxFormatted}). Tính năng tải ảnh và xuất bản bài viết có thể bị tạm dừng để bảo vệ hệ thống. Vui lòng rà soát và xóa bớt các file ảnh cũ bên dưới để giải phóng bộ nhớ ngay lập tức.
              </p>
            </div>
          </div>
        )}

        {storage.percent >= 80 && storage.percent < 95 && (
          <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs sm:text-sm">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold block text-amber-900 text-sm">
                Cảnh Báo: Dung Lượng Lưu Trữ Đã Vượt Quá 80%
              </strong>
              <p className="mt-0.5 leading-relaxed">
                Hệ thống lưu trữ đang sử dụng {storage.percent}% hạn mức quy định ({storage.usedFormatted}). Khuyến nghị quản trị viên xóa các hình ảnh không còn sử dụng hoặc bài nháp cũ để giải phóng không gian máy chủ.
              </p>
            </div>
          </div>
        )}

        {/* Thông báo thao tác thành công / lỗi */}
        {uploadSuccess && (
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{uploadSuccess}</span>
            </div>
            <button
              onClick={() => setUploadSuccess(null)}
              className="text-emerald-600 hover:text-emerald-900 p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {uploadError && (
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{uploadError}</span>
            </div>
            <button
              onClick={() => setUploadError(null)}
              className="text-rose-600 hover:text-rose-900 p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* CHUYỂN TAB: KHO ẢNH & KHO BÀI VIẾT */}
      <div className="flex border-b border-slate-200 gap-4 text-sm font-bold">
        <button
          onClick={() => setActiveTab("media")}
          className={`flex items-center gap-2 pb-3 border-b-2 transition-colors ${
            activeTab === "media"
              ? "border-azure-600 text-azure-700"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>Kho Ảnh & Tệp Tải Lên</span>
          <span className="text-[11px] font-mono font-normal bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full">
            {images.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab("posts")}
          className={`flex items-center gap-2 pb-3 border-b-2 transition-colors ${
            activeTab === "posts"
              ? "border-azure-600 text-azure-700"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Kho Lưu Trữ Bài Viết</span>
          <span className="text-[11px] font-mono font-normal bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full">
            {posts.length}
          </span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: KHO ẢNH & TỆP TIN */}
      {/* ======================================================== */}
      {activeTab === "media" && (
        <div className="space-y-6">
          {/* KHUNG TẢI ẢNH MỚI LÊN (UPLOAD ZONE) */}
          <div className="bg-white rounded-2xl border-2 border-dashed border-slate-300 p-6 sm:p-8 text-center hover:border-azure-400 transition-colors">
            <div className="max-w-md mx-auto space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-azure-50 text-azure-600 flex items-center justify-center">
                <UploadCloud className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Tải Ảnh Lên Kho Lưu Trữ Server
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Kéo thả ảnh vào đây hoặc bấm nút duyệt file từ thiết bị của bạn.
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5 font-mono">
                  Hỗ trợ JPG, PNG, WebP, SVG (Tối đa 5MB/ảnh)
                </p>
              </div>

              <div className="pt-2">
                <label className="inline-block cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e.target.files)}
                    disabled={isUploading || storage.percent >= 100}
                    className="hidden"
                  />
                  <span
                    className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs shadow-xs transition-colors ${
                      isUploading || storage.percent >= 100
                        ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                        : "bg-azure-600 text-white hover:bg-azure-700 tap-press"
                    }`}
                  >
                    {isUploading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Đang tải ảnh lên máy chủ…</span>
                      </>
                    ) : storage.percent >= 100 ? (
                      <>
                        <AlertTriangle className="w-4 h-4 text-rose-500" />
                        <span>Server đã đầy bộ nhớ</span>
                      </>
                    ) : (
                      <>
                        <UploadCloud className="w-4 h-4" />
                        <span>Chọn Tệp Ảnh Từ Máy</span>
                      </>
                    )}
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* BỘ LỌC KHO ẢNH */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
              {/* Tìm kiếm tên file */}
              <div className="relative flex-1 min-w-[200px]">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Tìm theo tên file ảnh hoặc URL…"
                  value={mediaSearch}
                  onChange={(e) => setMediaSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-azure-500 focus:bg-white"
                />
                {mediaSearch && (
                  <button
                    onClick={() => setMediaSearch("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Lọc theo thư mục */}
              <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1">
                <FolderOpen className="w-3.5 h-3.5 text-slate-400" />
                <select
                  value={mediaFolderFilter}
                  onChange={(e) => setMediaFolderFilter(e.target.value)}
                  className="bg-transparent border-0 text-slate-700 font-semibold focus:ring-0 cursor-pointer text-xs"
                >
                  <option value="all">Tất cả thư mục</option>
                  <option value="uploads">Tải lên (/uploads)</option>
                  <option value="vietphuc">Hệ thống (/images/vietphuc)</option>
                </select>
              </div>

              {/* Lọc theo thời gian */}
              <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <select
                  value={mediaTimeFilter}
                  onChange={(e) => setMediaTimeFilter(e.target.value)}
                  className="bg-transparent border-0 text-slate-700 font-semibold focus:ring-0 cursor-pointer text-xs"
                >
                  <option value="all">Tất cả thời gian</option>
                  <option value="7days">7 ngày gần nhất</option>
                  <option value="30days">30 ngày gần nhất</option>
                  <option value="older">Cũ hơn 30 ngày</option>
                </select>
              </div>

              {/* Sắp xếp */}
              <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <select
                  value={mediaSort}
                  onChange={(e) => setMediaSort(e.target.value)}
                  className="bg-transparent border-0 text-slate-700 font-semibold focus:ring-0 cursor-pointer text-xs"
                >
                  <option value="newest">Mới nhất trước</option>
                  <option value="oldest">Cũ nhất trước</option>
                  <option value="size_desc">Dung lượng lớn nhất</option>
                  <option value="size_asc">Dung lượng nhỏ nhất</option>
                </select>
              </div>
            </div>

            <div className="text-slate-500 text-[11px]">
              Hiển thị: <strong className="font-mono">{filteredImages.length}</strong> / <span className="font-mono">{images.length}</span> ảnh
            </div>
          </div>

          {/* LƯỚI DANH SÁCH ẢNH */}
          {filteredImages.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
              <ImageIcon className="w-10 h-10 text-slate-300 mx-auto" />
              <div className="text-slate-600 font-semibold text-sm">
                Không tìm thấy hình ảnh nào phù hợp với bộ lọc.
              </div>
              <p className="text-xs text-slate-400">
                Hãy thử thay đổi từ khóa tìm kiếm hoặc chọn lại mốc thời gian / thư mục.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filteredImages.map((img) => {
                const isSystem = img.folder === "vietphuc";
                return (
                  <div
                    key={img.url}
                    className="group bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs hover:border-azure-300 transition-colors flex flex-col justify-between"
                  >
                    {/* Thumbnail Image Container */}
                    <div className="relative aspect-4/3 bg-slate-100 overflow-hidden cursor-pointer" onClick={() => setPreviewImage(img)}>
                      <Image
                        src={img.url}
                        alt={img.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 20vw"
                      />

                      {/* Badge thư mục */}
                      <div className="absolute top-2 left-2">
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded shadow-xs ${
                            isSystem
                              ? "bg-slate-900/80 text-slate-200 border border-slate-700"
                              : "bg-azure-600/90 text-white"
                          }`}
                        >
                          {isSystem ? "Hệ thống" : "Tải lên"}
                        </span>
                      </div>

                      {/* Badge kích thước */}
                      {img.size && (
                        <div className="absolute bottom-2 right-2">
                          <span className="text-[9px] font-mono bg-black/70 text-white px-1.5 py-0.5 rounded">
                            {formatFileSize(img.size)}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Thông tin tên file và ngày tạo */}
                    <div className="p-3 space-y-1.5 flex-1 flex flex-col justify-between">
                      <div>
                        <p
                          className="text-xs font-semibold text-slate-800 truncate"
                          title={img.name}
                        >
                          {img.name}
                        </p>
                        <p className="text-[10px] text-slate-400 font-mono">
                          {img.createdAt
                            ? new Date(img.createdAt).toLocaleDateString("vi-VN")
                            : "Không rõ ngày"}
                        </p>
                      </div>

                      {/* Nút tác vụ: Xem, Sao chép link, Xóa */}
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-1">
                        <button
                          onClick={() => setPreviewImage(img)}
                          title="Xem ảnh cỡ lớn"
                          className="p-1.5 text-slate-500 hover:text-azure-700 hover:bg-azure-50 rounded-lg transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleCopy(img.url)}
                          title="Sao chép đường dẫn ảnh"
                          className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors relative"
                        >
                          {copiedUrl === img.url ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>

                        {/* NÚT XÓA ẢNH GIẢI PHÓNG DUNG LƯỢNG */}
                        {isSystem ? (
                          <span
                            title="Ảnh hệ thống được bảo vệ an toàn, không được phép xóa."
                            className="p-1.5 text-slate-300 cursor-not-allowed"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </span>
                        ) : (
                          <button
                            onClick={() => setDeleteCandidate(img)}
                            title="Xóa ảnh vĩnh viễn khỏi server để giải phóng bộ nhớ"
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: KHO LƯU TRỮ BÀI VIẾT TIN TỨC */}
      {/* ======================================================== */}
      {activeTab === "posts" && (
        <div className="space-y-6">
          {/* BỘ LỌC BÀI VIẾT */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
              {/* Tìm kiếm bài viết */}
              <div className="relative flex-1 min-w-[200px]">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Tìm theo tiêu đề, trích dẫn bài viết…"
                  value={postSearch}
                  onChange={(e) => setPostSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-azure-500 focus:bg-white"
                />
                {postSearch && (
                  <button
                    onClick={() => setPostSearch("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Lọc theo chuyên mục */}
              <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1">
                <FolderOpen className="w-3.5 h-3.5 text-slate-400" />
                <select
                  value={postCategoryFilter}
                  onChange={(e) => setPostCategoryFilter(e.target.value)}
                  className="bg-transparent border-0 text-slate-700 font-semibold focus:ring-0 cursor-pointer text-xs"
                >
                  <option value="all">Tất cả chuyên mục</option>
                  {postCategories.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Lọc theo trạng thái */}
              <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1">
                <select
                  value={postStatusFilter}
                  onChange={(e) => setPostStatusFilter(e.target.value)}
                  className="bg-transparent border-0 text-slate-700 font-semibold focus:ring-0 cursor-pointer text-xs"
                >
                  <option value="all">Tất cả trạng thái</option>
                  <option value="published">Đã xuất bản</option>
                  <option value="draft">Bản nháp</option>
                </select>
              </div>

              {/* Lọc theo thời gian */}
              <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <select
                  value={postTimeFilter}
                  onChange={(e) => setPostTimeFilter(e.target.value)}
                  className="bg-transparent border-0 text-slate-700 font-semibold focus:ring-0 cursor-pointer text-xs"
                >
                  <option value="all">Tất cả thời gian</option>
                  <option value="7days">7 ngày gần nhất</option>
                  <option value="30days">30 ngày gần nhất</option>
                </select>
              </div>
            </div>

            <div className="text-slate-500 text-[11px]">
              Hiển thị: <strong className="font-mono">{filteredPosts.length}</strong> / <span className="font-mono">{posts.length}</span> bài viết
            </div>
          </div>

          {/* BẢNG DANH SÁCH BÀI VIẾT */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            {filteredPosts.length === 0 ? (
              <div className="p-12 text-center text-slate-400 text-xs">
                Không tìm thấy bài viết nào phù hợp với bộ lọc tìm kiếm.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 text-xs font-semibold">
                    <tr>
                      <th className="py-4 px-6">Bài viết</th>
                      <th className="py-4 px-6">Chuyên mục</th>
                      <th className="py-4 px-6">Trạng thái</th>
                      <th className="py-4 px-6">Lượt xem</th>
                      <th className="py-4 px-6">Ngày tạo</th>
                      <th className="py-4 px-6 text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredPosts.map((post) => (
                      <tr key={post.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="relative w-14 h-10 rounded-lg overflow-hidden shrink-0 bg-slate-100 border border-slate-200">
                              <Image
                                src={post.coverImage}
                                alt={post.title}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="max-w-xs sm:max-w-md">
                              <div className="font-bold text-slate-900 line-clamp-1 text-sm">
                                {post.title}
                              </div>
                              <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                                {post.excerpt}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-azure-700 font-bold whitespace-nowrap">
                          {post.category}
                        </td>
                        <td className="py-4 px-6 whitespace-nowrap">
                          <span
                            className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                              post.isPublished
                                ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                                : "bg-slate-100 text-slate-600 border border-slate-300"
                            }`}
                          >
                            {post.isPublished ? "Đã xuất bản" : "Bản nháp"}
                          </span>
                        </td>
                        <td className="py-4 px-6 font-mono font-bold text-slate-900 tabular-nums">
                          {post.viewCount}
                        </td>
                        <td className="py-4 px-6 text-slate-500 font-mono tabular-nums whitespace-nowrap">
                          {new Date(post.createdAt).toLocaleDateString("vi-VN")}
                        </td>
                        <td className="py-4 px-6 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-2">
                            <Link
                              href={`/news/${post.slug}`}
                              target="_blank"
                              title="Xem bài viết trên web"
                              className="p-1.5 text-slate-500 hover:text-azure-700 rounded-lg hover:bg-azure-50 transition-colors"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Link>

                            <Link
                              href={`/admin/posts/${post.id}`}
                              title="Chỉnh sửa bài viết"
                              className="p-1.5 text-slate-500 hover:text-gold-600 rounded-lg hover:bg-amber-50 transition-colors"
                            >
                              <Edit className="w-4 h-4" />
                            </Link>

                            <button
                              type="button"
                              onClick={() => setPostToDelete(post)}
                              title="Xóa bài viết"
                              className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL XEM TRƯỚC ẢNH (PREVIEW MODAL) */}
      {/* ======================================================== */}
      {previewImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-sm truncate max-w-md">
                  {previewImage.name}
                </h3>
                <p className="text-[11px] text-slate-500 font-mono">
                  {formatFileSize(previewImage.size)} • {previewImage.url}
                </p>
              </div>
              <button
                onClick={() => setPreviewImage(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="relative flex-1 min-h-[300px] bg-slate-900 flex items-center justify-center p-4">
              <div className="relative w-full h-[360px]">
                <Image
                  src={previewImage.url}
                  alt={previewImage.name}
                  fill
                  className="object-contain"
                />
              </div>
            </div>

            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCopy(previewImage.url)}
                className="text-xs font-semibold text-slate-700"
              >
                {copiedUrl === previewImage.url ? (
                  <>
                    <Check className="w-3.5 h-3.5 mr-1.5 text-emerald-600" />
                    <span>Đã sao chép URL!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 mr-1.5" />
                    <span>Sao Chép Đường Dẫn</span>
                  </>
                )}
              </Button>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPreviewImage(null)}
                  className="text-xs font-semibold text-slate-600"
                >
                  Đóng
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL XÁC NHẬN XÓA ẢNH GIẢI PHÓNG DUNG LƯỢNG */}
      {/* ======================================================== */}
      {deleteCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl p-6 space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-lg font-bold text-slate-950">
                Xác Nhận Xóa Ảnh Khỏi Server?
              </h3>
              <p className="text-xs text-slate-500">
                Hành động này sẽ xóa file vĩnh viễn và không thể khôi phục.
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-500">Tên file:</span>
                <strong className="text-slate-800 font-mono truncate max-w-[200px]">
                  {deleteCandidate.name}
                </strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Dung lượng giải phóng:</span>
                <strong className="text-emerald-700 font-mono">
                  {formatFileSize(deleteCandidate.size)}
                </strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Đường dẫn:</span>
                <span className="text-slate-600 font-mono truncate max-w-[200px]">
                  {deleteCandidate.url}
                </span>
              </div>
            </div>

            {deleteMediaError && (
              <div className="p-2.5 rounded-lg bg-rose-50 text-rose-700 text-xs">
                {deleteMediaError}
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDeleteCandidate(null)}
                disabled={isDeletingMedia}
                className="text-xs font-semibold"
              >
                Hủy Bỏ
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={handleConfirmDeleteMedia}
                disabled={isDeletingMedia}
                className="text-xs font-bold"
              >
                {isDeletingMedia ? "Đang xóa…" : "Đồng Ý Xóa Vĩnh Viễn"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL XÁC NHẬN XÓA BÀI VIẾT */}
      {/* ======================================================== */}
      {postToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl p-6 space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-lg font-bold text-slate-950">
                Xác Nhận Xóa Bài Viết?
              </h3>
              <p className="text-xs text-slate-500">
                Bạn có chắc chắn muốn xóa bài viết này khỏi cơ sở dữ liệu?
              </p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
              <div className="font-bold text-slate-900 line-clamp-2">
                {postToDelete.title}
              </div>
              <div className="text-[11px] text-slate-500 mt-1">
                Chuyên mục: <strong>{postToDelete.category}</strong>
              </div>
            </div>

            {deletePostError && (
              <div className="p-2.5 rounded-lg bg-rose-50 text-rose-700 text-xs">
                {deletePostError}
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPostToDelete(null)}
                disabled={isDeletingPost}
                className="text-xs font-semibold"
              >
                Hủy Bỏ
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={handleConfirmDeletePost}
                disabled={isDeletingPost}
                className="text-xs font-bold"
              >
                {isDeletingPost ? "Đang xóa…" : "Đồng Ý Xóa"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
