"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import {
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
  Heading2,
  Heading3,
  Heading4,
  Type,
  ImagePlus,
  Undo,
  Redo,
  Code,
  Layout,
  X,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { MediaPickerModal } from "@/components/admin/MediaPickerModal";

export interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: string;
  label?: string;
  helperText?: string;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Nhập nội dung bài viết hoặc dịch vụ tại đây…",
  minHeight = "320px",
  label,
  helperText,
}: RichTextEditorProps) {
  const [activeMode, setActiveMode] = useState<"visual" | "code">("visual");
  const editorRef = useRef<HTMLDivElement>(null);
  const savedSelectionRef = useRef<Range | null>(null);

  // Modal chọn ảnh từ thư viện
  const [isPickerOpen, setIsPickerOpen] = useState(false);

  // Modal thiết lập chú thích ảnh & vị trí
  const [pendingImageUrl, setPendingImageUrl] = useState<string | null>(null);
  const [imageCaption, setImageCaption] = useState("");
  const [imageAlign, setImageAlign] = useState<"center" | "left" | "right" | "full">("center");

  // Lưu selection hiện tại trước khi click mở modal
  const saveSelection = () => {
    if (typeof window === "undefined") return;
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      savedSelectionRef.current = sel.getRangeAt(0).cloneRange();
    }
  };

  // Khôi phục selection sau khi modal đóng
  const restoreSelection = () => {
    if (typeof window === "undefined" || !savedSelectionRef.current) return;
    const sel = window.getSelection();
    if (sel) {
      sel.removeAllRanges();
      sel.addRange(savedSelectionRef.current);
    }
  };

  // Cập nhật nội dung editor khi giá trị value từ bên ngoài thay đổi
  useEffect(() => {
    if (editorRef.current && activeMode === "visual") {
      if (editorRef.current.innerHTML !== (value || "")) {
        editorRef.current.innerHTML = value || "";
      }
    }
  }, [value, activeMode]);

  // Xử lý khi người dùng gõ vào editor
  const handleInput = useCallback(() => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      onChange(html);
    }
  }, [onChange]);

  // Thực thi lệnh định dạng document.execCommand
  const executeCommand = (command: string, val: string | undefined = undefined) => {
    if (activeMode !== "visual") return;
    if (editorRef.current) {
      editorRef.current.focus();
      document.execCommand(command, false, val);
      handleInput();
    }
  };

  // Áp dụng định dạng khối tiêu đề (H2, H3, H4, P, Blockquote)
  const applyHeading = (tag: string) => {
    if (activeMode !== "visual") return;
    if (editorRef.current) {
      editorRef.current.focus();
      document.execCommand("formatBlock", false, `<${tag}>`);
      handleInput();
    }
  };

  // Mở modal chọn ảnh
  const handleOpenImagePicker = () => {
    saveSelection();
    setIsPickerOpen(true);
  };

  // Nhận URL ảnh từ MediaPickerModal
  const handleImagePicked = (url: string) => {
    setIsPickerOpen(false);
    setPendingImageUrl(url);
    setImageCaption("");
    setImageAlign("center");
  };

  // Xác nhận chèn ảnh kèm chú thích
  const handleConfirmInsertImage = () => {
    if (!pendingImageUrl) return;

    if (activeMode !== "visual") {
      setActiveMode("visual");
    }

    setTimeout(() => {
      if (editorRef.current) {
        editorRef.current.focus();
        restoreSelection();

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
          ? `<figcaption class="mt-2 text-xs sm:text-sm text-slate-500 italic text-center font-normal">${safeCaption}</figcaption>`
          : "";

        const figureHtml = `<figure class="${alignClass}"><img src="${pendingImageUrl}" alt="${safeCaption || 'Hình ảnh minh họa'}" class="${imgClass}" />${figcaptionHtml}</figure><p><br/></p>`;

        document.execCommand("insertHTML", false, figureHtml);
        handleInput();
      }
      setPendingImageUrl(null);
    }, 50);
  };

  return (
    <div className="space-y-2">
      {/* Tiêu đề & Hướng dẫn */}
      {(label || helperText) && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          {label && (
            <label className="text-xs font-bold text-slate-900 block">
              {label}
            </label>
          )}
          {helperText && (
            <span className="text-[11px] text-slate-500">
              {helperText}
            </span>
          )}
        </div>
      )}

      {/* Khung Editor Bo Tròn Sang Trọng */}
      <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-xs focus-within:border-azure-500 transition-colors">
        {/* THANH CÔNG CỤ SOẠN THẢO (TOOLBAR) */}
        <div className="p-2 sm:p-2.5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center gap-1.5 text-xs">
          {/* 1. Nhóm Tiêu Đề */}
          <div className="flex items-center bg-white border border-slate-200 rounded-xl p-0.5">
            <button
              type="button"
              onClick={() => applyHeading("h2")}
              title="Tiêu đề 2 (Mục lớn)"
              className="p-1.5 rounded-lg text-slate-700 hover:bg-slate-100 hover:text-azure-700 font-bold transition-colors"
            >
              <Heading2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => applyHeading("h3")}
              title="Tiêu đề 3 (Mục vừa)"
              className="p-1.5 rounded-lg text-slate-700 hover:bg-slate-100 hover:text-azure-700 font-bold transition-colors"
            >
              <Heading3 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => applyHeading("h4")}
              title="Tiêu đề 4 (Tiểu mục)"
              className="p-1.5 rounded-lg text-slate-700 hover:bg-slate-100 hover:text-azure-700 font-bold transition-colors"
            >
              <Heading4 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => applyHeading("p")}
              title="Đoạn văn bản thường"
              className="p-1.5 rounded-lg text-slate-700 hover:bg-slate-100 hover:text-azure-700 transition-colors"
            >
              <Type className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => applyHeading("blockquote")}
              title="Khối trích dẫn / Ghi chú đặc biệt"
              className="p-1.5 rounded-lg text-slate-700 hover:bg-slate-100 hover:text-azure-700 transition-colors"
            >
              <Quote className="w-4 h-4" />
            </button>
          </div>

          <div className="h-5 w-px bg-slate-200 hidden sm:block" />

          {/* 2. Nhóm Định Dạng Phông Chữ (B, I, U) */}
          <div className="flex items-center bg-white border border-slate-200 rounded-xl p-0.5">
            <button
              type="button"
              onClick={() => executeCommand("bold")}
              title="In đậm (Ctrl+B)"
              className="p-1.5 rounded-lg text-slate-700 hover:bg-slate-100 hover:text-azure-700 font-bold transition-colors"
            >
              <Bold className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => executeCommand("italic")}
              title="In nghiêng (Ctrl+I)"
              className="p-1.5 rounded-lg text-slate-700 hover:bg-slate-100 hover:text-azure-700 transition-colors"
            >
              <Italic className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => executeCommand("underline")}
              title="Gạch chân (Ctrl+U)"
              className="p-1.5 rounded-lg text-slate-700 hover:bg-slate-100 hover:text-azure-700 transition-colors"
            >
              <Underline className="w-4 h-4" />
            </button>
          </div>

          {/* 3. Nhóm Căn Lề */}
          <div className="flex items-center bg-white border border-slate-200 rounded-xl p-0.5">
            <button
              type="button"
              onClick={() => executeCommand("justifyLeft")}
              title="Căn lề trái"
              className="p-1.5 rounded-lg text-slate-700 hover:bg-slate-100 hover:text-azure-700 transition-colors"
            >
              <AlignLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => executeCommand("justifyCenter")}
              title="Căn giữa"
              className="p-1.5 rounded-lg text-slate-700 hover:bg-slate-100 hover:text-azure-700 transition-colors"
            >
              <AlignCenter className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => executeCommand("justifyRight")}
              title="Căn lề phải"
              className="p-1.5 rounded-lg text-slate-700 hover:bg-slate-100 hover:text-azure-700 transition-colors"
            >
              <AlignRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => executeCommand("justifyFull")}
              title="Căn đều hai bên"
              className="p-1.5 rounded-lg text-slate-700 hover:bg-slate-100 hover:text-azure-700 transition-colors"
            >
              <AlignJustify className="w-4 h-4" />
            </button>
          </div>

          {/* 4. Nhóm Danh Sách Gạch Đầu Dòng */}
          <div className="flex items-center bg-white border border-slate-200 rounded-xl p-0.5">
            <button
              type="button"
              onClick={() => executeCommand("insertUnorderedList")}
              title="Danh sách gạch đầu dòng (Bullet list)"
              className="p-1.5 rounded-lg text-slate-700 hover:bg-slate-100 hover:text-azure-700 transition-colors"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => executeCommand("insertOrderedList")}
              title="Danh sách đánh số (Numbered list)"
              className="p-1.5 rounded-lg text-slate-700 hover:bg-slate-100 hover:text-azure-700 transition-colors"
            >
              <ListOrdered className="w-4 h-4" />
            </button>
          </div>

          <div className="h-5 w-px bg-slate-200 hidden sm:block" />

          {/* 5. Nút Chèn Ảnh Kèm Chú Thích */}
          <button
            type="button"
            onClick={handleOpenImagePicker}
            title="Chèn ảnh kèm chú thích vào nội dung"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-azure-50 hover:bg-azure-100 text-azure-700 font-bold border border-azure-200 transition-colors"
          >
            <ImagePlus className="w-4 h-4" />
            <span className="hidden sm:inline">Chèn Ảnh & Chú Thích</span>
          </button>

          {/* 6. Nhóm Hoàn Tác (Undo / Redo) */}
          <div className="flex items-center bg-white border border-slate-200 rounded-xl p-0.5 ml-auto">
            <button
              type="button"
              onClick={() => executeCommand("undo")}
              title="Hoàn tác (Ctrl+Z)"
              className="p-1.5 rounded-lg text-slate-700 hover:bg-slate-100 hover:text-azure-700 transition-colors"
            >
              <Undo className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => executeCommand("redo")}
              title="Làm lại (Ctrl+Y)"
              className="p-1.5 rounded-lg text-slate-700 hover:bg-slate-100 hover:text-azure-700 transition-colors"
            >
              <Redo className="w-4 h-4" />
            </button>
          </div>

          {/* 7. Nút Chuyển Đổi Trực Quan / Mã HTML */}
          <button
            type="button"
            onClick={() => setActiveMode((prev) => (prev === "visual" ? "code" : "visual"))}
            title={activeMode === "visual" ? "Xem mã HTML" : "Quay lại chế độ soạn thảo trực quan"}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl border font-bold text-xs transition-colors ${
              activeMode === "code"
                ? "bg-azure-600 text-white border-azure-600 shadow-xs"
                : "bg-white text-slate-600 border-slate-200 hover:bg-slate-100"
            }`}
          >
            {activeMode === "visual" ? (
              <>
                <Code className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Xem HTML</span>
              </>
            ) : (
              <>
                <Layout className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Trực Quan</span>
              </>
            )}
          </button>
        </div>

        {/* VÙNG SOẠN THẢO NỘI DUNG (CONTENT EDITABLE HOẶC TEXTAREA CODE) */}
        {activeMode === "visual" ? (
          <div
            ref={editorRef}
            contentEditable
            onInput={handleInput}
            onBlur={handleInput}
            style={{ minHeight }}
            data-placeholder={placeholder}
            className="rich-content p-4 sm:p-6 outline-hidden focus:outline-hidden text-slate-900 leading-relaxed overflow-y-auto cursor-text empty:before:content-[attr(data-placeholder)] empty:before:text-slate-400 empty:before:pointer-events-none"
          />
        ) : (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            style={{ minHeight }}
            className="w-full p-4 sm:p-6 font-mono text-xs text-slate-800 bg-slate-50 outline-hidden focus:outline-hidden border-0 leading-relaxed resize-y"
            placeholder="Nhập hoặc chỉnh sửa trực tiếp mã HTML tại đây…"
          />
        )}
      </div>

      {/* MODAL 1: CHỌN ẢNH TỪ THƯ VIỆN HOẶC TẢI LÊN */}
      <MediaPickerModal
        isOpen={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
        onSelect={handleImagePicked}
        title="Chọn ảnh minh họa chèn vào bài viết"
      />

      {/* MODAL 2: ĐIỀN CHÚ THÍCH ẢNH & CHỌN CĂN LỀ */}
      {pendingImageUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 motion-safe:animate-fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <h3 className="font-bold text-slate-950 text-base">
                Thiết Lập Chú Thích & Căn Lề Ảnh
              </h3>
              <button
                type="button"
                onClick={() => setPendingImageUrl(null)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Xem trước ảnh đã chọn */}
            <div className="relative h-48 w-full rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
              <Image
                src={pendingImageUrl}
                alt="Selected preview"
                fill
                className="object-contain"
              />
            </div>

            {/* Ô nhập chú thích ảnh */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">
                Chú thích ảnh (Caption hiển thị dưới ảnh):
              </label>
              <input
                type="text"
                value={imageCaption}
                onChange={(e) => setImageCaption(e.target.value)}
                placeholder="Ví dụ: Đội xe đầu kéo container của GT Logistics tại Cửa khẩu Hữu Nghị…"
                className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:border-azure-500 focus:bg-white focus:outline-hidden"
              />
            </div>

            {/* Chọn căn lề ảnh */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">
                Vị trí hiển thị ảnh:
              </label>
              <div className="grid grid-cols-4 gap-2 text-xs">
                {(
                  [
                    { id: "center", label: "Căn giữa" },
                    { id: "left", label: "Nổi bên trái" },
                    { id: "right", label: "Nổi bên phải" },
                    { id: "full", label: "Tràn viền" },
                  ] as const
                ).map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setImageAlign(opt.id)}
                    className={`py-2 px-1 rounded-xl font-bold border transition-colors text-center ${
                      imageAlign === opt.id
                        ? "bg-azure-600 text-white border-azure-600 shadow-xs"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Nút hành động */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPendingImageUrl(null)}
                className="text-xs font-semibold"
              >
                Hủy Bỏ
              </Button>
              <Button
                variant="accent"
                size="sm"
                onClick={handleConfirmInsertImage}
                className="text-xs font-bold"
              >
                <Check className="w-4 h-4 mr-1.5" />
                <span>Chèn Vào Văn Bản</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
