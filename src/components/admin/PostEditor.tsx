"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Save,
  ArrowLeft,
  Image as ImageIcon,
  ImagePlus,
  CheckCircle2,
  AlertCircle,
  Eye,
  FileEdit,
  Code,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Quote,
  Heading1,
  Heading2,
  Heading3,
  Type,
  Undo,
  Redo,
  Sparkles,
  X,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { createPost, updatePost } from "@/modules/posts/actions";
import { MediaPickerModal } from "@/components/admin/MediaPickerModal";

// Kho ảnh Logistics gợi ý sẵn chất lượng cao
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
  const editorRef = useRef<HTMLDivElement>(null);
  const savedSelectionRef = useRef<Range | null>(null);

  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    category: initialData?.category || "Tin tức ngành",
    excerpt: initialData?.excerpt || "",
    content:
      initialData?.content ||
      `<h2>1. Giới thiệu tổng quan nội dung</h2>
<p>Nhập nội dung bài viết tin tức, thông báo hoặc cẩm nang xuất nhập khẩu tại đây. Bạn có thể chọn bôi đen chữ để in đậm, in nghiêng, căn chỉnh lề hoặc bấm nút chèn ảnh từ kho ảnh có kèm chú thích trực quan.</p>
<h3>2. Các lưu ý nghiệp vụ quan trọng</h3>
<ul>
  <li>Điểm lưu ý thực tế số 1 trong quy trình logistics</li>
  <li>Điểm lưu ý số 2 về chứng từ thông quan hải quan chính ngạch</li>
</ul>`,
    coverImage:
      initialData?.coverImage ||
      "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1200&q=80",
    isPublished: initialData?.isPublished ?? true,
  });

  // Chế độ xem: "visual" (Trực quan WYSIWYG), "html" (Mã nguồn HTML), "preview" (Xem trước như bài thật)
  const [activeMode, setActiveMode] = useState<"visual" | "html" | "preview">("visual");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Modal chọn ảnh
  const [isCoverPickerOpen, setIsCoverPickerOpen] = useState(false);
  const [isInlinePickerOpen, setIsInlinePickerOpen] = useState(false);

  // Dialog nhập caption cho ảnh vừa chọn
  const [pendingImageUrl, setPendingImageUrl] = useState<string | null>(null);
  const [imageCaption, setImageCaption] = useState("");
  const [imageAlign, setImageAlign] = useState<"center" | "left" | "right" | "full">("center");

  // Đồng bộ nội dung vào editorRef khi mount hoặc chuyển đổi tab
  useEffect(() => {
    if (editorRef.current && activeMode === "visual") {
      editorRef.current.innerHTML = formData.content;
    }
  }, [activeMode]);

  // Cập nhật nội dung khi người dùng gõ trong contentEditable
  const handleEditorInput = () => {
    if (editorRef.current) {
      setFormData((prev) => ({
        ...prev,
        content: editorRef.current?.innerHTML || "",
      }));
    }
  };

  // Lưu vùng chọn con trỏ chuột
  const saveCurrentSelection = () => {
    if (typeof window !== "undefined") {
      const sel = window.getSelection();
      if (sel && sel.rangeCount > 0) {
        savedSelectionRef.current = sel.getRangeAt(0).cloneRange();
      }
    }
  };

  // Khôi phục vùng chọn con trỏ chuột
  const restoreSavedSelection = () => {
    if (typeof window !== "undefined" && savedSelectionRef.current) {
      const sel = window.getSelection();
      if (sel) {
        sel.removeAllRanges();
        sel.addRange(savedSelectionRef.current);
      }
    }
  };

  // Thực thi lệnh định dạng văn bản (Bold, Italic, v.v.)
  const executeCommand = (command: string, value: string | undefined = undefined) => {
    if (activeMode !== "visual") return;
    if (editorRef.current) {
      editorRef.current.focus();
      document.execCommand(command, false, value);
      handleEditorInput();
    }
  };

  // Xử lý đổi tiêu đề (H1, H2, H3, P)
  const applyHeading = (tag: string) => {
    if (activeMode !== "visual") return;
    if (editorRef.current) {
      editorRef.current.focus();
      document.execCommand("formatBlock", false, `<${tag}>`);
      handleEditorInput();
    }
  };

  // Mở modal chọn ảnh chèn vào bài viết
  const handleOpenInlineImagePicker = () => {
    saveCurrentSelection();
    setIsInlinePickerOpen(true);
  };

  // Sau khi chọn ảnh từ thư viện, mở bước điền caption
  const handleSelectInlineImage = (url: string) => {
    setIsInlinePickerOpen(false);
    setPendingImageUrl(url);
    setImageCaption("");
    setImageAlign("center");
  };

  // Xác nhận chèn ảnh kèm chú thích vào nội dung bài viết
  const confirmInsertImageWithCaption = () => {
    if (!pendingImageUrl) return;

    if (activeMode !== "visual") {
      setActiveMode("visual");
    }

    setTimeout(() => {
      if (editorRef.current) {
        editorRef.current.focus();
        restoreSavedSelection();

        let alignClass = "my-6 text-center max-w-full";
        let imgClass = "rounded-2xl max-w-full h-auto mx-auto shadow-xs border border-slate-200/80";

        if (imageAlign === "left") {
          alignClass = "my-4 float-left mr-6 max-w-sm text-left";
          imgClass = "rounded-2xl w-full h-auto shadow-xs border border-slate-200/80";
        } else if (imageAlign === "right") {
          alignClass = "my-4 float-right ml-6 max-w-sm text-right";
          imgClass = "rounded-2xl w-full h-auto shadow-xs border border-slate-200/80";
        } else if (imageAlign === "full") {
          alignClass = "my-6 text-center w-full";
          imgClass = "rounded-2xl w-full h-auto shadow-xs border border-slate-200/80";
        }

        const safeCaption = imageCaption.trim();
        const figcaptionHtml = safeCaption
          ? `<figcaption class="mt-2.5 text-xs sm:text-sm text-slate-500 italic text-center font-normal">${safeCaption}</figcaption>`
          : "";

        const figureHtml = `<figure class="${alignClass}"><img src="${pendingImageUrl}" alt="${safeCaption || formData.title || 'Ảnh minh họa'}" class="${imgClass}" />${figcaptionHtml}</figure><p><br/></p>`;

        document.execCommand("insertHTML", false, figureHtml);
        handleEditorInput();
      }
      setPendingImageUrl(null);
    }, 50);
  };

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
      {/* Thanh tác vụ trên cùng */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors whitespace-nowrap"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại danh sách bài viết</span>
        </button>

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer mr-3 select-none">
            <input
              type="checkbox"
              checked={formData.isPublished}
              onChange={(e) =>
                setFormData({ ...formData, isPublished: e.target.checked })
              }
              className="w-4 h-4 text-azure-600 rounded border-slate-300 focus:ring-azure-500"
            />
            <span>Xuất bản công khai</span>
          </label>

          <Button
            type="submit"
            variant="accent"
            size="md"
            isLoading={loading}
            className="font-bold shadow-md shadow-gold-500/10 tap-press"
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
        {/* Cột trái: Form nhập bài viết chính */}
        <div className="lg:col-span-8 space-y-6">
          {/* Tiêu đề & Tóm tắt */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                Tiêu Đề Bài Viết *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Ví dụ: Quy trình làm thủ tục thông quan hàng hóa qua Cửa khẩu Quốc tế Móng Cái 2026…"
                className="w-full px-4 py-3 text-base font-bold text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-azure-500 placeholder:text-slate-400 placeholder:font-normal"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                Đoạn Trích Tóm Tắt (Excerpt) *
              </label>
              <textarea
                rows={3}
                required
                value={formData.excerpt}
                onChange={(e) =>
                  setFormData({ ...formData, excerpt: e.target.value })
                }
                placeholder="Nhập 1 - 2 câu tóm lược ngắn gọn nội dung bài viết để hiển thị trên thẻ bài và kết quả tìm kiếm…"
                className="w-full px-4 py-2.5 text-xs text-slate-700 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-azure-500 placeholder:text-slate-400 leading-relaxed"
              />
            </div>
          </div>

          {/* TRÌNH SOẠN THẢO TRỰC QUAN (WYSIWYG RICH TEXT EDITOR) */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
            {/* Thanh điều hướng chế độ xem */}
            <div className="p-4 bg-slate-50/80 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-slate-900 block">
                  Nội Dung Chi Tiết Bài Viết
                </span>
                <span className="text-[11px] text-slate-500 block">
                  Soạn thảo trực quan dễ dùng như Word / Google Docs cho mọi nhân sự
                </span>
              </div>

              <div className="flex rounded-xl bg-slate-200/80 p-1 text-xs font-bold gap-1">
                <button
                  type="button"
                  onClick={() => {
                    if (activeMode === "html" && editorRef.current) {
                      editorRef.current.innerHTML = formData.content;
                    }
                    setActiveMode("visual");
                  }}
                  className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
                    activeMode === "visual"
                      ? "bg-white text-azure-700 shadow-xs"
                      : "text-slate-600 hover:text-slate-950"
                  }`}
                >
                  <FileEdit className="w-3.5 h-3.5" />
                  <span>Soạn Thảo Trực Quan</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (activeMode === "visual" && editorRef.current) {
                      setFormData((p) => ({ ...p, content: editorRef.current?.innerHTML || "" }));
                    }
                    setActiveMode("html");
                  }}
                  className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
                    activeMode === "html"
                      ? "bg-white text-azure-700 shadow-xs"
                      : "text-slate-600 hover:text-slate-950"
                  }`}
                >
                  <Code className="w-3.5 h-3.5" />
                  <span>Xem Mã HTML</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (activeMode === "visual" && editorRef.current) {
                      setFormData((p) => ({ ...p, content: editorRef.current?.innerHTML || "" }));
                    }
                    setActiveMode("preview");
                  }}
                  className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
                    activeMode === "preview"
                      ? "bg-white text-azure-700 shadow-xs"
                      : "text-slate-600 hover:text-slate-950"
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Xem Trước</span>
                </button>
              </div>
            </div>

            {/* THANH CÔNG CỤ SOẠN THẢO TRỰC QUAN (STICKY TOOLBAR) */}
            {activeMode === "visual" && (
              <div className="p-3 bg-white border-b border-slate-200 flex flex-wrap items-center gap-1.5 sticky top-0 z-10 shadow-xs">
                {/* 1. Nhóm Đề Mục (Headings) */}
                <div className="flex items-center gap-1 border-r border-slate-200 pr-2">
                  <button
                    type="button"
                    onClick={() => applyHeading("p")}
                    title="Văn bản thông thường (Paragraph)"
                    className="px-2 py-1 text-xs font-bold text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
                  >
                    Văn bản
                  </button>
                  <button
                    type="button"
                    onClick={() => applyHeading("h1")}
                    title="Tiêu đề cấp 1 (H1)"
                    className="p-1.5 text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
                  >
                    <Heading1 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => applyHeading("h2")}
                    title="Tiêu đề cấp 2 (H2)"
                    className="p-1.5 text-slate-700 hover:bg-slate-100 rounded-md transition-colors font-bold"
                  >
                    <Heading2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => applyHeading("h3")}
                    title="Tiêu đề cấp 3 (H3)"
                    className="p-1.5 text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
                  >
                    <Heading3 className="w-4 h-4" />
                  </button>
                </div>

                {/* 2. Nhóm Định Dạng Kiểu Chữ (Bold, Italic, Underline) */}
                <div className="flex items-center gap-1 border-r border-slate-200 pr-2">
                  <button
                    type="button"
                    onClick={() => executeCommand("bold")}
                    title="In Đậm (Ctrl+B)"
                    className="p-1.5 text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
                  >
                    <Bold className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => executeCommand("italic")}
                    title="In Nghiêng (Ctrl+I)"
                    className="p-1.5 text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
                  >
                    <Italic className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => executeCommand("underline")}
                    title="Gạch Chân (Ctrl+U)"
                    className="p-1.5 text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
                  >
                    <Underline className="w-4 h-4" />
                  </button>
                </div>

                {/* 3. Nhóm Căn Lề (Alignments) */}
                <div className="flex items-center gap-1 border-r border-slate-200 pr-2">
                  <button
                    type="button"
                    onClick={() => executeCommand("justifyLeft")}
                    title="Căn Trái"
                    className="p-1.5 text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
                  >
                    <AlignLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => executeCommand("justifyCenter")}
                    title="Căn Giữa"
                    className="p-1.5 text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
                  >
                    <AlignCenter className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => executeCommand("justifyRight")}
                    title="Căn Phải"
                    className="p-1.5 text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
                  >
                    <AlignRight className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => executeCommand("justifyFull")}
                    title="Căn Đều 2 Bên"
                    className="p-1.5 text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
                  >
                    <AlignJustify className="w-4 h-4" />
                  </button>
                </div>

                {/* 4. Nhóm Danh Sách & Trích Dẫn */}
                <div className="flex items-center gap-1 border-r border-slate-200 pr-2">
                  <button
                    type="button"
                    onClick={() => executeCommand("insertUnorderedList")}
                    title="Danh sách gạch đầu dòng"
                    className="p-1.5 text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
                  >
                    <List className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => executeCommand("insertOrderedList")}
                    title="Danh sách đánh số"
                    className="p-1.5 text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
                  >
                    <ListOrdered className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => applyHeading("blockquote")}
                    title="Khối trích dẫn nổi bật"
                    className="p-1.5 text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
                  >
                    <Quote className="w-4 h-4" />
                  </button>
                </div>

                {/* 5. NÚT CHÈN ẢNH KÈM CHÚ THÍCH (NỔI BẬT DỄ THẤY) */}
                <button
                  type="button"
                  onClick={handleOpenInlineImagePicker}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-azure-50 border border-azure-300 text-azure-700 hover:bg-azure-100 text-xs font-bold transition-colors shadow-xs ml-1"
                  title="Chèn ảnh từ kho ảnh hệ thống kèm chú thích ảnh trực quan"
                >
                  <ImagePlus className="w-4 h-4 text-azure-600" />
                  <span>Chèn Ảnh & Chú Thích</span>
                </button>

                {/* 6. Nhóm Hoàn Tác (Undo / Redo / Clear) */}
                <div className="flex items-center gap-1 ml-auto">
                  <button
                    type="button"
                    onClick={() => executeCommand("undo")}
                    title="Hoàn tác (Ctrl+Z)"
                    className="p-1.5 text-slate-500 hover:text-slate-900 rounded-md transition-colors"
                  >
                    <Undo className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => executeCommand("redo")}
                    title="Làm lại (Ctrl+Y)"
                    className="p-1.5 text-slate-500 hover:text-slate-900 rounded-md transition-colors"
                  >
                    <Redo className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* VÙNG NỘI DUNG SOẠN THẢO */}
            <div className="p-6">
              {activeMode === "visual" && (
                <div
                  ref={editorRef}
                  contentEditable
                  onInput={handleEditorInput}
                  onKeyUp={saveCurrentSelection}
                  onMouseUp={saveCurrentSelection}
                  className="rich-content min-h-[480px] p-4 bg-white rounded-xl focus:outline-none border border-slate-100 leading-relaxed text-slate-800"
                  style={{ wordBreak: "break-word" }}
                />
              )}

              {activeMode === "html" && (
                <div className="space-y-2">
                  <span className="text-[11px] text-slate-500 block">
                    Mã HTML nguyên bản (Dành cho người muốn kiểm soát mã chi tiết):
                  </span>
                  <textarea
                    rows={18}
                    required
                    value={formData.content}
                    onChange={(e) =>
                      setFormData({ ...formData, content: e.target.value })
                    }
                    className="w-full font-mono text-xs text-slate-800 p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-azure-500 leading-relaxed"
                  />
                </div>
              )}

              {activeMode === "preview" && (
                <div className="max-w-3xl mx-auto py-4 space-y-6">
                  {/* Xem trước bài viết hoàn chỉnh */}
                  <div className="space-y-2 border-b border-slate-100 pb-4">
                    <span className="text-xs font-bold text-azure-700 bg-azure-50 px-2.5 py-0.5 rounded-full border border-azure-200">
                      {formData.category}
                    </span>
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-950">
                      {formData.title || "Tiêu đề bài viết..."}
                    </h1>
                    <p className="text-xs text-slate-500 font-medium">
                      Ngày đăng: {new Date().toLocaleDateString("vi-VN")}
                    </p>
                  </div>

                  {formData.excerpt && (
                    <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-700 italic">
                      {formData.excerpt}
                    </div>
                  )}

                  {formData.coverImage && (
                    <div className="relative h-64 sm:h-80 w-full rounded-2xl overflow-hidden border border-slate-200">
                      <Image
                        src={formData.coverImage}
                        alt="Ảnh bìa xem trước"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}

                  <article
                    className="rich-content text-slate-700 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: formData.content }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Cột phải: Chuyên mục & Chọn Ảnh Bìa */}
        <div className="lg:col-span-4 space-y-6">
          {/* Chuyên mục bài viết */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                Chuyên Mục Bài Viết
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="w-full px-3.5 py-2.5 text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-azure-500"
              >
                <option value="Tin tức ngành">Tin tức ngành logistics</option>
                <option value="Cẩm nang XNK">Cẩm nang xuất nhập khẩu</option>
                <option value="Thông báo công ty">Thông báo công ty</option>
                <option value="Chính sách hải quan">Chính sách hải quan & biên mậu</option>
              </select>
            </div>
          </div>

          {/* Chọn Ảnh Bìa Tuyển Chọn */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-800">
                  Ảnh Bìa Bài Viết (Cover Image)
                </label>
                <button
                  type="button"
                  onClick={() => setIsCoverPickerOpen(true)}
                  className="text-xs font-bold text-azure-700 hover:text-azure-900 flex items-center gap-1 transition-colors"
                >
                  <ImagePlus className="w-3.5 h-3.5" />
                  <span>Chọn từ kho ảnh</span>
                </button>
              </div>

              {/* Preview Ảnh bìa hiện tại */}
              <div className="relative h-44 w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 mb-3 shadow-xs">
                {formData.coverImage ? (
                  <Image
                    src={formData.coverImage}
                    alt="Ảnh bìa bài viết"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-slate-400 text-xs">
                    Chưa chọn ảnh bìa
                  </div>
                )}
              </div>

              {/* Nhập URL ảnh tùy ý */}
              <input
                type="url"
                required
                value={formData.coverImage}
                onChange={(e) =>
                  setFormData({ ...formData, coverImage: e.target.value })
                }
                placeholder="Nhập đường link ảnh hoặc chọn từ kho ảnh…"
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-azure-500 text-slate-800"
              />
            </div>

            {/* Kho ảnh tuyển chọn nhanh ngành logistics */}
            <div>
              <span className="block text-xs font-bold text-slate-700 mb-2">
                Ảnh Gợi Ý Chất Lượng Cao:
              </span>
              <div className="grid grid-cols-2 gap-2">
                {SUGGESTED_IMAGES.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, coverImage: img.url })
                    }
                    className={`relative h-20 rounded-xl overflow-hidden border-2 transition-colors duration-150 ${
                      formData.coverImage === img.url
                        ? "border-azure-600 ring-2 ring-azure-400/40"
                        : "border-transparent opacity-80 hover:opacity-100 hover:border-slate-300"
                    }`}
                  >
                    <Image
                      src={img.url}
                      alt={img.label}
                      fill
                      className="object-cover"
                    />
                    <span className="absolute inset-x-0 bottom-0 bg-slate-950/75 text-white text-[9px] p-1 truncate font-medium">
                      {img.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL 1: Chọn Ảnh Bìa từ Kho Ảnh */}
      {isCoverPickerOpen && (
        <MediaPickerModal
          isOpen={isCoverPickerOpen}
          onClose={() => setIsCoverPickerOpen(false)}
          onSelect={(url) => {
            setFormData({ ...formData, coverImage: url });
            setIsCoverPickerOpen(false);
          }}
          currentImage={formData.coverImage}
          title="Chọn Ảnh Bìa Bài Viết Từ Thư Viện"
        />
      )}

      {/* MODAL 2: Chọn Ảnh Chèn Vào Bài Viết */}
      {isInlinePickerOpen && (
        <MediaPickerModal
          isOpen={isInlinePickerOpen}
          onClose={() => setIsInlinePickerOpen(false)}
          onSelect={handleSelectInlineImage}
          title="Chọn Hoặc Tải Ảnh Chèn Vào Bài Viết"
        />
      )}

      {/* DIALOG 3: Nhập Chú Thích Ảnh & Căn Lề Trước Khi Chèn */}
      {pendingImageUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-lg w-full p-6 space-y-5 shadow-2xl animate-in fade-in-0 zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-azure-50 border border-azure-200 text-azure-700 flex items-center justify-center font-bold">
                  <ImagePlus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-950">
                    Thêm Chú Thích Cho Ảnh
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Ảnh sẽ được chèn kèm chú thích rõ ràng bên dưới
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPendingImageUrl(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Xem trước ảnh đã chọn */}
            <div className="relative h-48 w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
              <Image
                src={pendingImageUrl}
                alt="Ảnh được chọn"
                fill
                className="object-cover"
              />
            </div>

            {/* Nhập Chú thích (Caption) */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-800">
                Chú Thích Ảnh (Hiển thị ngay dưới ảnh)
              </label>
              <input
                type="text"
                value={imageCaption}
                onChange={(e) => setImageCaption(e.target.value)}
                placeholder="Ví dụ: Đội xe 50 container GT Logistics làm thủ tục thông quan tại Móng Cái…"
                className="w-full px-3.5 py-2.5 text-xs text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-azure-500 placeholder:text-slate-400"
              />
            </div>

            {/* Chọn Căn lề ảnh */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-800">
                Căn Chỉnh Vị Trí Ảnh
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setImageAlign("center")}
                  className={`px-3 py-2 rounded-xl text-xs font-bold border transition-colors flex items-center justify-center gap-1.5 ${
                    imageAlign === "center"
                      ? "bg-azure-50 text-azure-700 border-azure-400 ring-1 ring-azure-400/30"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <AlignCenter className="w-3.5 h-3.5" />
                  <span>Căn Giữa</span>
                </button>

                <button
                  type="button"
                  onClick={() => setImageAlign("left")}
                  className={`px-3 py-2 rounded-xl text-xs font-bold border transition-colors flex items-center justify-center gap-1.5 ${
                    imageAlign === "left"
                      ? "bg-azure-50 text-azure-700 border-azure-400 ring-1 ring-azure-400/30"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <AlignLeft className="w-3.5 h-3.5" />
                  <span>Nằm Bên Trái</span>
                </button>

                <button
                  type="button"
                  onClick={() => setImageAlign("right")}
                  className={`px-3 py-2 rounded-xl text-xs font-bold border transition-colors flex items-center justify-center gap-1.5 ${
                    imageAlign === "right"
                      ? "bg-azure-50 text-azure-700 border-azure-400 ring-1 ring-azure-400/30"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <AlignRight className="w-3.5 h-3.5" />
                  <span>Nằm Bên Phải</span>
                </button>
              </div>
            </div>

            {/* Nút hành động */}
            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setPendingImageUrl(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors"
              >
                Hủy
              </button>
              <Button
                type="button"
                variant="accent"
                size="sm"
                onClick={confirmInsertImageWithCaption}
                className="font-bold shadow-md shadow-gold-500/10"
              >
                <Check className="w-4 h-4 mr-1.5" />
                <span>Chèn Vào Bài Viết</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
