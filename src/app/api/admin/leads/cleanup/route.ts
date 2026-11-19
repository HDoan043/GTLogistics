import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentAdmin } from "@/lib/auth";
import { revalidatePath } from "next/cache";
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

function formatDateTag(d: Date): string {
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
}

export async function POST(request: NextRequest) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return new NextResponse("Unauthorized - Vui lòng đăng nhập quyền quản trị", {
        status: 401,
      });
    }

    const body = await request.json().catch(() => ({}));
    const scope = body.scope || "ALL"; // "ALL" hoặc "CLOSED" hoặc "PROCESSED" (CLOSED + QUOTED)

    const where: Record<string, unknown> = {};
    if (scope === "CLOSED") {
      where.status = "CLOSED";
    } else if (scope === "PROCESSED") {
      where.status = { in: ["CLOSED", "QUOTED"] };
    }

    // Lấy các bản ghi theo phạm vi dọn dẹp, sắp xếp theo thời gian cũ nhất đến mới nhất
    const leads = await prisma.lead.findMany({
      where,
      orderBy: { createdAt: "asc" },
    });

    if (leads.length === 0) {
      return NextResponse.json(
        { error: "Không tìm thấy dữ liệu báo giá nào phù hợp với phạm vi đã chọn để dọn dẹp." },
        { status: 400 }
      );
    }

    // Xác định khoảng thời gian của dữ liệu được dọn dẹp
    const earliestDate = new Date(leads[0].createdAt);
    const latestDate = new Date(leads[leads.length - 1].createdAt);
    const fromStr = formatDateTag(earliestDate);
    const toStr = formatDateTag(latestDate);

    const filename =
      fromStr === toStr
        ? `Sao_Luu_Bao_Gia_GT_Logistics_Ngay_${fromStr}.xlsx`
        : `Sao_Luu_Bao_Gia_GT_Logistics_Tu_${fromStr}_Den_${toStr}.xlsx`;

    // 1. Chuyển đổi dữ liệu sang định dạng bảng tính Excel (.xlsx)
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
        "Mã Yêu Cầu": lead.id,
        "Thời Gian Gửi": formattedDate,
        "Họ Và Tên": lead.fullName,
        "Số Điện Thoại": lead.phone,
        "Email": lead.email || "-",
        "Công Ty / Doanh Nghiệp": lead.company || "-",
        "Dịch Vụ Quan Tâm": lead.serviceType,
        "Tuyến Xuất Phát (Đi)": lead.routeOrigin || "-",
        "Tuyến Đến (Đích)": lead.routeDestination || "-",
        "Chi Tiết Lô Hàng / Yêu Cầu": lead.cargoDetails || lead.message || "-",
        "Trạng Thái Xử Lý": getStatusLabel(lead.status),
        "Ghi Chú Nội Bộ": lead.notes || "",
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(rows);

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

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Lịch Sử Báo Giá Sao Lưu");

    const fileBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "buffer",
    });

    // 2. Xóa các bản ghi đã được sao lưu an toàn ra khỏi database để giải phóng bộ nhớ
    const leadIds = leads.map((l) => l.id);
    await prisma.lead.deleteMany({
      where: {
        id: { in: leadIds },
      },
    });

    revalidatePath("/admin/leads");
    revalidatePath("/admin/dashboard");

    const encodedFilename = encodeURIComponent(filename);

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${filename}"; filename*=UTF-8''${encodedFilename}`,
        "X-Deleted-Count": String(leadIds.length),
        "X-Filename": encodedFilename,
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    });
  } catch (error) {
    console.error("Lỗi dọn dẹp & sao lưu dữ liệu báo giá:", error);
    return new NextResponse("Lỗi máy chủ khi dọn dẹp dữ liệu.", { status: 500 });
  }
}
