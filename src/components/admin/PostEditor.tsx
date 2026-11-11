"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Save,
  ArrowLeft,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Eye,
  FileEdit,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { createPost, updatePost } from "@/modules/posts/actions";

// Kho ảnh Logistics đẹp chọn lọc sẵn chất lượng cao
const SUGGESTED_IMAGES = [
  {
    label: "Cảng Biển & Container Cẩu Bờ",
    url: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1200&q=80",
  },
  {
    label: "Đoàn Xe Đầu Kéo Cao Tốc",
    url: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=1200&q=80",
  },
  {
    label: "Tàu Thủy & Cảng Biển Xanh",
    url: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=1200&q=80",
  },
  {
    label: "Kho Hàng Hiện Đại Logistics",
    url: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80",
  },
  {
    label: "Chứng Từ & Khai Báo Hải Quan",
    url: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80",
  },
  {
    label: "Bản Đồ Vận Tải Quốc Tế",
    url: "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=1200&q=80",
  },
];

interface PostEditorProps {
  initialData?: {
    id?: string;
    title: string;
    category: string;
    excerpt: string;
    content: string;
    coverImage: string;
    isPublished: boolean;
  };
  isEdit?: boolean;
}

export function PostEditor({ initialData, isEdit = false }: PostEditorProps) {
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    category: initialData?.category || "Tin tức ngành",
    excerpt: initialData?.excerpt || "",
    content:
      initialData?.content ||
      `<h2>1. Nội dung tiêu đề mục chính</h2>
<p>Nhập nội dung bài viết tin tức hoặc cẩm nang xuất nhập khẩu tại đây...</p>
<ul>
  <li>Điểm lưu ý số 1</li>
  <li>Điểm lưu ý số 2</li>
</ul>`,
    coverImage:
      initialData?.coverImage ||
      "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1200&q=80",
    isPublished: initialData?.isPublished ?? true,
  });

  const [previewTab, setPreviewTab] = useState<"edit" | "preview">("edit");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    let res;
    if (isEdit && initialData?.id) {
      res = await updatePost(initialData.id, formData);
    } else {
      res = await createPost(formData);
    }

    setLoading(false);

    if (res.success) {
      setMessage({ type: "success", text: res.message });
      setTimeout(() => {
        router.push("/admin/posts");
        router.refresh();
      }, 1000);
    } else {
      setMessage({ type: "error", text: res.message });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại danh sách</span>
        </button>

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer mr-3">
            <input
              type="checkbox"
              checked={formData.isPublished}
              onChange={(e) =>
                setFormData({ ...formData, isPublished: e.target.checked })
              }
              className="w-4 h-4 text-brand-600 rounded"
            />
            <span>Xuất bản công khai</span>
          </label>

          <Button
            type="submit"
            variant="accent"
            size="md"
            isLoading={loading}
            className="font-bold shadow-md"
          >
            <Save className="w-4 h-4 mr-1.5" />
            <span>{isEdit ? "Lưu Thay Đổi" : "Đăng Bài Viết"}</span>
          </Button>
        </div>
      </div>

      {message && (
        <div
          className={`p-4 rounded-xl flex items-center gap-2.5 text-xs font-semibold ${
            message.type === "success"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : "bg-rose-50 text-rose-800 border border-rose-200"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Cột trái: Form nhập văn bản chính */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">
                Tiêu Đề Bài Viết *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Ví dụ: Hướng dẫn thủ tục hải quan xuất khẩu nông sản 2026..."
                className="w-full px-4 py-3 text-base font-bold bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">
                Đoạn Trích Tóm Tắt (Excerpt) *
              </label>
              <textarea
                rows={3}
                required
                value={formData.excerpt}
                onChange={(e) =>
                  setFormData({ ...formData, excerpt: e.target.value })
                }
                placeholder="Đoạn văn ngắn 1-2 câu tóm lược nội dung để hiển thị trên Google và thẻ bài viết..."
                className="w-full px-4 py-2.5 text-xs text-slate-700 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          {/* Trình Soạn Thảo Nội Dung (Rich Text / HTML Editor) */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <label className="block text-xs font-bold text-slate-700 uppercase">
                Nội Dung Chi Tiết (Hỗ trợ HTML / Định dạng) *
              </label>

              <div className="flex rounded-lg bg-slate-100 p-0.5 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setPreviewTab("edit")}
                  className={`px-3 py-1 rounded-md flex items-center gap-1.5 ${
                    previewTab === "edit"
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <FileEdit className="w-3.5 h-3.5" />
                  <span>Soạn Thảo</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewTab("preview")}
                  className={`px-3 py-1 rounded-md flex items-center gap-1.5 ${
                    previewTab === "preview"
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Xem Trước</span>
                </button>
              </div>
            </div>

            {previewTab === "edit" ? (
              <textarea
                rows={16}
                required
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
                className="w-full font-mono text-xs text-slate-800 p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500 leading-relaxed"
              />
            ) : (
              <div
                className="prose max-w-none p-4 min-h-[300px] border border-slate-200 rounded-xl bg-slate-50/50"
                dangerouslySetInnerHTML={{ __html: formData.content }}
              />
            )}
          </div>
        </div>

        {/* Cột phải: Chuyên mục & Chọn Ảnh Bìa Tuyển Chọn */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">
                Chuyên Mục Bài Viết
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="Tin tức ngành">Tin tức ngành logistics</option>
                <option value="Cẩm nang XNK">Cẩm nang xuất nhập khẩu</option>
                <option value="Thông báo công ty">Thông báo công ty</option>
              </select>
            </div>
          </div>

          {/* Chọn Ảnh Bìa */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase flex items-center justify-between">
                <span>Ảnh Bìa Bài Viết (Cover Image)</span>
                <ImageIcon className="w-4 h-4 text-slate-400" />
              </label>

              {/* Preview Ảnh hiện tại */}
              <div className="relative h-40 w-full rounded-xl overflow-hidden bg-slate-100 border border-slate-200 mb-3">
                <Image
                  src={formData.coverImage}
                  alt="Ảnh bìa bài viết"
                  fill
                  className="object-cover"
                />
              </div>

              {/* Nhập URL ảnh tùy ý */}
              <input
                type="url"
                required
                value={formData.coverImage}
                onChange={(e) =>
                  setFormData({ ...formData, coverImage: e.target.value })
                }
                placeholder="Nhập đường link ảnh hoặc chọn mẫu bên dưới..."
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            {/* Thư viện ảnh chọn nhanh chất lượng cao */}
            <div>
              <span className="block text-[11px] font-bold text-slate-500 mb-2 uppercase">
                Chọn Nhanh Ảnh Đẹp Ngành Logistics:
              </span>
              <div className="grid grid-cols-2 gap-2">
                {SUGGESTED_IMAGES.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, coverImage: img.url })
                    }
                    className={`relative h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      formData.coverImage === img.url
                        ? "border-accent-500 ring-2 ring-accent-400 scale-[1.02]"
                        : "border-transparent opacity-75 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={img.url}
                      alt={img.label}
                      fill
                      className="object-cover"
                    />
                    <span className="absolute inset-x-0 bottom-0 bg-black/60 text-white text-[9px] p-1 truncate">
                      {img.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
