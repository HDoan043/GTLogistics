/**
 * Làm sạch nội dung HTML từ Rich Text Editor để ngăn chặn XSS attacks
 * Loại bỏ các thẻ nguy hiểm (script, iframe, object, embed...) và các event handlers (onload, onerror, onclick...)
 */
export function sanitizeHtml(html: string): string {
  if (!html) return "";
  return html
    // Xóa thẻ script và nội dung bên trong
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    // Xóa thẻ iframe, object, embed, form, input, button
    .replace(/<\/?(iframe|object|embed|form|input|button|meta|link|style)\b[^>]*>/gi, "")
    // Xóa các inline event handlers như onload, onerror, onclick, onmouseover...
    .replace(/\s+on[a-z]+\s*=\s*(['"][^'"]*['"]|[^\s>]+)/gi, "")
    // Xóa javascript: pseudo protocol trong href hoặc src
    .replace(/href\s*=\s*['"]\s*javascript:[^'"]*['"]/gi, 'href="#"')
    .replace(/src\s*=\s*['"]\s*javascript:[^'"]*['"]/gi, 'src=""');
}

/**
 * Tạo slug chuẩn SEO từ tiêu đề tiếng Việt (bỏ dấu tiếng Việt, ký tự đặc biệt)
 */
export function generateSlug(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[đĐ]/g, "d")
    .replace(/[^a-z0-9 -]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}
