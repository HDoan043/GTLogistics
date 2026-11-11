# HTC LOGISTICS - CỔNG THÔNG TIN DOANH NGHIỆP & HỆ THỐNG CMS QUẢN TRỊ

> Dự án website doanh nghiệp chuẩn hóa phong cách **HTC Logistics (https://logisticshtc.com/)**, xây dựng trên nền tảng **Next.js 15 (App Router, TypeScript, Tailwind CSS)**, kết hợp kiến trúc module hóa cao cấp (Feature-based Modular Architecture), tích hợp Admin CMS đăng bài, tiếp nhận yêu cầu báo giá/liên hệ, nút gọi nhanh Zalo/Hotline, bảo mật chống tấn công và cẩm nang triển khai máy chủ thực tế.

---

## 🌟 Tính Năng Nổi Bật

### 1. Giao Diện Khách Hàng (Public Client Website)
* **Giao diện chuẩn phong cách HTC Logistics:** Đầy đủ các phần Giới thiệu, Lưới dịch vụ, Cam kết chất lượng, Tin tức cẩm nang XNK, Số liệu thống kê ấn tượng, Chân trang pháp lý.
* **Tiện ích Nổi (Floating Widgets):** Nút chat Zalo hiệu ứng sóng lan tỏa (Pulsing Ripple Effect) mở trực tiếp ứng dụng Zalo, nút gọi nhanh Hotline và nút cuộn mượt về đầu trang.
* **Tra Cứu Vận Đơn Thời Gian Thực (Tracking System):** Nhập mã vận đơn (mã mẫu: `HTC889922` hoặc `HTC556677`) hiển thị tiến độ hành trình trực quan.
* **Yêu Cầu Báo Giá Trực Tuyến:** Form tiếp nhận lô hàng (nơi đi, nơi đến, loại hàng, số điện thoại) lưu trực tiếp vào cơ sở dữ liệu và chuyển về hộp thư Admin.
* **Kho Ảnh Logistics Đẹp Tuyển Chọn:** Sử dụng hình ảnh chuẩn chuyên ngành vận tải đường bộ, đường thủy, kho bãi và tàu biển.
* **Tối Ưu SEO & Tốc Độ:** Server-Side Rendering (SSR), Static Generation (ISR 60s), Metadata chuẩn Google Open Graph.

### 2. Hệ Thống Quản Trị Nội Dung (Admin Dashboard CMS - `/admin`)
* **Đăng nhập Bảo Mật:** Mật khẩu băm Bcrypt 12 vòng, phiên làm việc HTTP-only Cookie JWT, chống Brute-force giới hạn số lần đăng nhập.
* **Quản Lý Bài Viết (CRUD Posts):**
  * Đăng bài viết mới với Trình soạn thảo Rich Text Editor (hỗ trợ HTML/Markdown trực quan).
  * Kho ảnh gợi ý chọn nhanh ảnh bìa logistics chất lượng cao hoặc nhập URL tùy ý.
  * Phân loại chuyên mục (*Tin tức ngành, Cẩm nang XNK, Thông báo công ty*).
  * Chế độ Xuất bản / Bản nháp (Draft).
* **Hộp Thư Khách Hàng Tiềm Năng (Leads Inbox):**
  * Quản lý toàn bộ danh sách khách gửi báo giá/liên hệ từ website.
  * Cập nhật trạng thái xử lý: *Mới tiếp nhận* ➔ *Đang tư vấn* ➔ *Đã gửi báo giá* ➔ *Đã chốt hợp đồng*.
* **Cấu Hình Thông Tin Động (Site Settings):**
  * Thay đổi Tên công ty, Slogan, Hotline, Số điện thoại Zalo, Email, Địa chỉ trụ sở Hải Phòng, Chi nhánh Móng Cái trực tiếp trong Admin mà **không cần sửa code**.

### 3. An Toàn Thông Tin & Chịu Tải (Security & Performance)
* **Rate Limiting:** Chống spam form báo giá (tối đa 5 lần/2 phút) và chống brute-force đăng nhập admin.
* **Bảo Mật Đầu Vào:** 100% dữ liệu qua Zod schema validation và isomorphic-dompurify để triệt tiêu nguy cơ XSS & SQL Injection.
* **Security Headers:** Cấu hình CSP, X-Frame-Options (chống Clickjacking), X-Content-Type-Options (nosniff).

---

## 🚀 Khởi Động Nhanh (Local Development)

### 1. Cài đặt thư viện:
```bash
npm install
```

### 2. Khởi tạo Cơ sở dữ liệu & Nạp dữ liệu mẫu:
```bash
npx prisma generate
npx prisma db push
npx tsx prisma/seed.ts
```

### 3. Chạy môi trường phát triển:
```bash
npm run dev
```
Mở trình duyệt truy cập: [http://localhost:3000](http://localhost:3000)

---

## 🔑 Thông Tin Đăng Nhập Quản Trị Mặc Định

* **Đường dẫn quản trị:** [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
* **Email:** `admin@htclogistics.vn`
* **Mật khẩu:** `Admin@HTC2026!`

*(Có thể thay đổi mật khẩu và email trong file `.env` hoặc tạo tài khoản mới).*

---

## 📦 Triển Khai Lên Server Thật & Mua Tên Miền

Dự án đã được trang bị sẵn toàn bộ cấu hình:
1. `docker/Dockerfile`: Docker multi-stage siêu nhẹ cho Next.js standalone.
2. `docker/nginx.conf`: Nginx Reverse Proxy tối ưu gzip, cache tĩnh và bảo mật SSL.
3. `docker-compose.yml`: Khởi chạy 1 lệnh trên mọi máy chủ Linux.
4. **Cẩm nang chi tiết cho người mới:** Xem tại file [`DEPLOYMENT_GUIDE.md`](./DEPLOYMENT_GUIDE.md) (Hướng dẫn từ bước mua domain, trỏ DNS, thuê VPS đến cài chứng chỉ SSL HTTPS miễn phí).
