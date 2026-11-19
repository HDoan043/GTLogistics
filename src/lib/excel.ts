/**
 * Chống lỗ hổng Formula Injection (CWE-1236) khi xuất tệp bảng tính Excel / CSV.
 * Nếu trường dữ liệu bắt đầu bằng các ký tự công thức kích hoạt (=, +, -, @, \t, \r),
 * hàm sẽ tiền tố thêm dấu nháy đơn (') để Microsoft Excel, Google Sheets hoặc LibreOffice
 * diễn giải ô tính dưới dạng chuỗi ký tự thuần túy (plain text), triệt tiêu nguy cơ thực thi mã độc.
 */
export function sanitizeExcelField(text: unknown): string {
  if (text === null || text === undefined) return "-";
  const str = String(text).trim();
  if (!str) return "-";
  if (/^[=+\-@\t\r]/.test(str)) {
    return `'${str}`;
  }
  return str;
}
