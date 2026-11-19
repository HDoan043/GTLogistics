import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentAdmin } from "@/lib/auth";
import { sanitizeExcelField } from "@/lib/excel";
import * as XLSX from "xlsx";

function getStatusLabel(status: string) {
  switch (status) {
    case "NEW":
      return "Mới tiếp nhận";
    case "CONTACTED":
      return "Đang tư vấn";
    case "QUOTED":
      return "Đã gửi báo giá";
    case "CLOSED":
      return "Đã chốt hợp đồng";
    default:
      return status;
  }
}

export async function GET(request: NextRequest) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return new NextResponse("Unauthorized - Vui lòng đăng nhập quyền quản trị", {
        status: 401,
      });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    const where: Record<string, unknown> = {};
    if (status && status !== "ALL") {
      where.status = status;
    }

    const leads = await prisma.lead.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    // Chuyển đổi dữ liệu sang định dạng bảng biểu Excel trực quan
    const rows = leads.map((lead, idx) => {
      const date = new Date(lead.createdAt);
      const formattedDate = date.toLocaleString("vi-VN", {
        timeZone: "Asia/Ho_Chi_Minh",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });

      return {
        "STT": idx + 1,
        "Mã Yêu Cầu": sanitizeExcelField(lead.id),
        "Thời Gian Gửi": formattedDate,
        "Họ Và Tên": sanitizeExcelField(lead.fullName),
        "Số Điện Thoại": sanitizeExcelField(lead.phone),
        "Email": sanitizeExcelField(lead.email),
        "Công Ty / Doanh Nghiệp": sanitizeExcelField(lead.company),
        "Dịch Vụ Quan Tâm": sanitizeExcelField(lead.serviceType),
        "Tuyến Xuất Phát (Đi)": sanitizeExcelField(lead.routeOrigin),
        "Tuyến Đến (Đích)": sanitizeExcelField(lead.routeDestination),
        "Chi Tiết Lô Hàng / Yêu Cầu": sanitizeExcelField(lead.cargoDetails || lead.message),
        "Trạng Thái Xử Lý": getStatusLabel(lead.status),
        "Ghi Chú Nội Bộ": sanitizeExcelField(lead.notes || ""),
      };
    });

    // Tạo bảng tính Excel (Worksheet)
    const worksheet = XLSX.utils.json_to_sheet(rows);

    // Cấu hình độ rộng cột tối ưu để nội dung hiển thị ngay ngắn, không bị che khuất
    worksheet["!cols"] = [
      { wch: 6 },  // STT
      { wch: 32 }, // Mã Yêu Cầu
      { wch: 18 }, // Thời Gian Gửi
      { wch: 24 }, // Họ Và Tên
      { wch: 16 }, // Số Điện Thoại
      { wch: 25 }, // Email
      { wch: 28 }, // Công Ty
      { wch: 30 }, // Dịch Vụ
      { wch: 22 }, // Tuyến Xuất Phát
      { wch: 22 }, // Tuyến Đến
      { wch: 45 }, // Chi Tiết Lô Hàng
      { wch: 20 }, // Trạng Thái Xử Lý
      { wch: 30 }, // Ghi Chú Nội Bộ
    ];

    // Tạo sổ tính Excel (Workbook)
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Danh Sách Báo Giá");

    // Tạo buffer nhị phân file .xlsx chuẩn Microsoft Excel
    const fileBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "buffer",
    });

    const now = new Date();
    const dateTag = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}_${String(now.getHours()).padStart(2, "0")}${String(now.getMinutes()).padStart(2, "0")}`;
    const filename = `Danh_Sach_Bao_Gia_GT_Logistics_${dateTag}.xlsx`;

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    });
  } catch (error) {
    console.error("Lỗi xuất file Excel báo giá:", error);
    return new NextResponse("Lỗi máy chủ khi tạo file Excel.", { status: 500 });
  }
}
