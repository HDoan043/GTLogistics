# CẨM NANG TRIỂN KHAI WEBSITE DOANH NGHIỆP LÊN SERVER THỰC TẾ
> Dành cho người mới bắt đầu: Hướng dẫn chi tiết từng bước từ mua tên miền, thuê máy chủ (VPS), cấu hình DNS, cài đặt SSL HTTPS miễn phí đến vận hành trang web chính thức.

---

## 1. Hiểu nhanh Nguyên lý Hoạt động của Website trên Internet

Để một khách hàng từ điện thoại/máy tính gõ tên miền (ví dụ: `logisticshtc.com`) và xem được website của công ty, có 3 thành phần chính:
1. **Tên miền (Domain Name):** Giống như "Địa chỉ nhà" (ví dụ: `congtyban.vn` hoặc `congtyban.com`).
2. **Máy chủ lưu trữ (Server/VPS):** Giống như "Ngôi nhà" chạy liên tục 24/7 để chứa mã nguồn website và cơ sở dữ liệu.
3. **Hệ thống phân giải tên miền (DNS):** Giống như "Người chỉ đường", biến chữ `congtyban.com` thành địa chỉ số IP của máy chủ (ví dụ `103.124.56.78`).

---

## 2. Chuẩn bị Trước khi Triển khai

### Bước 1: Mua Tên miền (Domain)
* **Nhà cung cấp tên miền uy tín tại Việt Nam:** iNET (`inet.vn`), PA Việt Nam (`pavietnam.vn`), MatBao (`matbao.net`), TENTEN (`tenten.vn`).
* **Nhà cung cấp quốc tế:** Cloudflare, Namecheap, GoDaddy.
* **Gợi ý:** Nếu là doanh nghiệp tại Việt Nam, nên mua đuôi `.vn` hoặc `.com.vn` để khẳng định uy tín thương hiệu, hoặc `.com` cho vận tải quốc tế.

### Bước 2: Chọn Phương thức Triển khai

Bạn có **2 lựa chọn phổ biến nhất** (chọn 1 trong 2):

| Tiêu chí | Lựa chọn A: Cloud Platform (Vercel / Railway) | Lựa chọn B: VPS Riêng (Ubuntu Linux) |
| :--- | :--- | :--- |
| **Độ khó** | ⭐ Cực kỳ dễ (Không cần gõ lệnh server) | ⭐⭐⭐ Trung bình (Dùng lệnh Docker chuẩn bị sẵn) |
| **Chi phí** | 0đ (Gói miễn phí/Free tier) hoặc ~5-20$/tháng | ~100.000đ - 250.000đ/tháng (Thuê VPS VN) |
| **Bảo trì** | Nền tảng tự lo máy chủ, tự lo SSL HTTPS | Tự quản lý máy chủ qua Docker |
| **Phù hợp** | Muốn chạy thử nghiệm nhanh hoặc web công ty vừa | Doanh nghiệp muốn toàn quyền sở hữu server riêng |

---

## 3. Lựa chọn A: Triển khai 1-Click lên Cloud (Vercel) - Khuyên dùng cho người mới

Vercel chính là công ty tạo ra Next.js, hỗ trợ triển khai website cực kỳ mạnh mẽ, tự động cấp HTTPS và tối ưu tốc độ toàn cầu miễn phí:

1. **Đưa mã nguồn lên GitHub:**
   - Tạo tài khoản miễn phí tại [github.com](https://github.com).
   - Đẩy toàn bộ thư mục dự án này lên repository của bạn trên GitHub.
2. **Kết nối với Vercel:**
   - Truy cập [vercel.com](https://vercel.com) và đăng nhập bằng tài khoản GitHub vừa tạo.
   - Nhấn **"Add New Project"** -> Chọn repository vừa tải lên.
3. **Cấu hình Biến môi trường (Environment Variables):**
   - Thêm các biến sau:
     * `JWT_SECRET`: Nhập một chuỗi ký tự ngẫu nhiên bất kỳ để bảo mật phiên đăng nhập admin.
     * `ADMIN_DEFAULT_EMAIL`: `admin@congtyban.vn`
     * `ADMIN_DEFAULT_PASSWORD`: Mật khẩu bạn muốn đặt cho Admin
4. **Nhấn Deploy:**
   - Chỉ sau khoảng 1-2 phút, website của bạn sẽ chạy chính thức với một đường link dạng `https://ten-du-an.vercel.app`.
5. **Gắn Tên miền riêng đã mua vào Vercel:**
   - Vào Settings của Project trên Vercel -> Chọn mục **Domains** -> Nhập tên miền (ví dụ: `congtyban.vn`).
   - Vercel sẽ hiển thị 2 bản ghi DNS (CNAME hoặc A record).
   - Bạn chỉ cần vào trang quản lý tên miền (nơi bạn mua tên miền) nhập đúng 2 bản ghi đó là xong!

---

## 4. Lựa chọn B: Triển khai lên VPS Riêng (Ubuntu + Docker)

Nếu công ty bạn muốn thuê một máy chủ ảo (VPS) riêng tại Việt Nam (như Vietnix, TinoHost, Viettel IDC, BKNS, hoặc quốc tế như Hetzner/DigitalOcean):

### Bước 1: Thuê VPS
* **Cấu hình tối thiểu khuyến nghị:** 2 CPU Cores, 2GB RAM, 20GB SSD, Hệ điều hành: **Ubuntu 22.04 LTS hoặc 24.04 LTS**.
* Sau khi mua, nhà cung cấp sẽ gửi cho bạn:
  * **Địa chỉ IP máy chủ:** ví dụ `103.56.12.89`
  * **Tài khoản đăng nhập:** `root`
  * **Mật khẩu:** `mat-khau-vps`

### Bước 2: Đăng nhập vào VPS qua SSH
* **Trên Windows:** Mở `PowerShell` hoặc phần mềm `PuTTY`, gõ lệnh:
  ```bash
  ssh root@103.56.12.89
  ```
  (Thay `103.56.12.89` bằng IP VPS thực tế của bạn, sau đó nhập mật khẩu).

### Bước 3: Cài đặt Docker & Docker Compose (Chạy lệnh tự động)
Copy và dán toàn bộ đoạn lệnh sau vào màn hình terminal VPS:

```bash
# Cập nhật hệ thống
sudo apt update && sudo apt upgrade -y

# Cài đặt Docker tự động
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Cài đặt Git
sudo apt install -y git
```

### Bước 4: Tải Dự án và Khởi chạy
```bash
# Clone source code từ Git hoặc tải thư mục lên VPS
git clone <URL_REPO_GITHUB_CUA_BAN> /var/www/htc-logistics
cd /var/www/htc-logistics

# Tạo file môi trường sản xuất
cp .env.example .env

# Chỉnh sửa thông tin mật khẩu bảo mật (dùng nano)
nano .env
# (Nhấn Ctrl + O để Lưu, Ctrl + X để Thoát)

# Khởi chạy toàn bộ hệ thống bằng Docker Compose (Tự động build & chạy ngầm)
docker compose up -d --build
```
> 🎉 **Xong!** Lúc này website đã chạy ngầm và bạn có thể gõ thẳng địa chỉ IP của VPS vào trình duyệt để kiểm tra.

---

## 5. Trỏ Tên Miền (DNS) & Cài Chứng chỉ Bảo mật SSL (HTTPS)

### 1. Cấu hình DNS trên trang quản lý tên miền
Đăng nhập vào trang quản lý tên miền mà bạn đã mua (iNET, Tenten, Mắt Bão...), tạo 2 bản ghi sau:

| Loại (Type) | Tên (Host / Name) | Giá trị (Points to / Value) |
| :--- | :--- | :--- |
| **A** | `@` | `103.56.12.89` (Điền IP VPS của bạn) |
| **A** | `www` | `103.56.12.89` (Điền IP VPS của bạn) |

*(Đợi khoảng 5 - 15 phút để tên miền được cập nhật trên internet).*

### 2. Cài SSL HTTPS miễn phí trọn đời với Certbot
Khi tên miền đã trỏ về IP VPS thành công, chạy lệnh sau trên VPS để cấp chứng chỉ HTTPS có ổ khóa xanh:

```bash
# Cài đặt certbot
sudo apt install -y certbot python3-certbot-nginx

# Tự động cấu hình chứng chỉ SSL cho tên miền của bạn
sudo certbot --nginx -d congtyban.vn -d www.congtyban.vn
```
Certbot sẽ tự động gia hạn chứng chỉ khi sắp hết hạn, bạn không cần phải làm thủ công.

---

## 6. Quy trình Quản trị & Vận hành Hàng ngày

1. **Đăng nhập quản trị viên:**
   - Truy cập: `https://congtyban.vn/admin/login`
   - Tài khoản mặc định: `admin@htclogistics.vn`
   - Mật khẩu: Theo cấu hình trong file `.env`
2. **Cập nhật thông tin công ty:**
   - Vào mục **Cài đặt (Settings)** trong Admin để đổi Số điện thoại Hotline, Link Zalo, Email, Địa chỉ trụ sở, Mã số thuế. Mọi thay đổi sẽ lập tức hiển thị ra trang web bên ngoài.
3. **Đăng bài viết mới:**
   - Vào mục **Bài viết (Posts)** -> **Thêm bài mới** -> Nhập tiêu đề, tải ảnh bìa, nhập nội dung cẩm nang/tin tức -> Bấm **Xuất bản**.
4. **Kiểm tra thông tin khách gửi báo giá / liên hệ:**
   - Vào mục **Khách hàng tiềm năng (Leads)** để xem danh sách số điện thoại, tuyến đường vận chuyển, mặt hàng mà khách đã điền trên web.

---

## 7. Sao lưu Dữ liệu (Backup & Phục hồi)

Toàn bộ bài viết, cấu hình và leads đều được lưu an toàn trong thư mục dữ liệu Docker volume (`/app/data`).
Để sao lưu định kỳ, bạn chỉ cần tải file cơ sở dữ liệu về máy:
```bash
# Lệnh copy file database ra ngoài thư mục backup
docker compose exec web cp /app/data/prod.db /app/data/backup_$(date +%F).db
```
Chúc bạn ra mắt website thành công mỹ mãn cho công ty!
