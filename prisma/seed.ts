import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Bắt đầu nạp dữ liệu chuẩn hóa cho LOGISTICS GT lên PostgreSQL Cloud...");

  // 1. Tạo tài khoản Admin mặc định
  const adminEmail = process.env.ADMIN_DEFAULT_EMAIL || "admin@logisticsgt.vn";
  const rawPassword = process.env.ADMIN_DEFAULT_PASSWORD || "Admin@GT2026!";
  const passwordHash = await bcrypt.hash(rawPassword, 12);

  const adminUser = await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: {
      passwordHash,
      fullName: "Quản Trị Viên GT Logistics",
      role: "ADMIN",
    },
    create: {
      email: adminEmail,
      passwordHash,
      fullName: "Quản Trị Viên GT Logistics",
      role: "ADMIN",
    },
  });
  console.log(`✅ Đã thiết lập tài khoản quản trị: ${adminEmail} (Mật khẩu: ${rawPassword})`);

  // Thêm tài khoản phụ tương thích
  const altEmail = "admin@htclogistics.vn";
  await prisma.adminUser.upsert({
    where: { email: altEmail },
    update: { passwordHash, fullName: "Quản Trị Viên GT" },
    create: { email: altEmail, passwordHash, fullName: "Quản Trị Viên GT", role: "ADMIN" },
  });

  // 2. Nạp cấu hình thông tin doanh nghiệp chính thức (SiteSettings)
  const defaultSettings = [
    { key: "companyName", value: "CÔNG TY TNHH LOGISTICS GT", description: "Tên pháp lý công ty" },
    { key: "shortName", value: "GT LOGISTICS", description: "Tên thương hiệu" },
    { key: "tagline", value: "Đồng Hành Tin Cậy - Phát Triển Bền Vững", description: "Khẩu hiệu chính thức trên biển hiệu" },
    { key: "hotline", value: "0904.382.268", description: "Số hotline gọi trực tiếp 24/7" },
    { key: "zaloPhone", value: "0904382268", description: "Số điện thoại kết nối Zalo" },
    { key: "email", value: "contact@logisticsgt.vn", description: "Hòm thư liên hệ chính" },
    { key: "taxCode", value: "5701750095", description: "Mã số thuế doanh nghiệp (Sở KH&ĐT Quảng Ninh)" },
    { key: "legalRep", value: "Lê Thanh Tâm", description: "Người đại diện theo pháp luật" },
    {
      key: "headquarters",
      value: "Căn ĐLTC-41, KĐT Vinhomes Golden Avenue, Cửa khẩu Bắc Luân 2, Phường Hải Hòa, TP. Móng Cái, Tỉnh Quảng Ninh",
      description: "Trụ sở điều hành chính Móng Cái",
    },
    {
      key: "branchHaiPhong",
      value: "Cụm Cảng Đình Vũ, Phường Đông Hải 2, Quận Hải An, TP. Hải Phòng",
      description: "Văn phòng Cảng Hải Phòng",
    },
    {
      key: "branchHanoi",
      value: "Số 18 Phạm Hùng, Phường Mỹ Đình, Quận Nam Từ Liêm, TP. Hà Nội",
      description: "Văn phòng đại diện Hà Nội",
    },
    {
      key: "workingHours",
      value: "Thứ Hai - Chủ Nhật: 07:30 - 18:30 (Trực cửa khẩu & thông quan 24/7)",
      description: "Thời gian làm việc",
    },
  ];

  for (const s of defaultSettings) {
    await prisma.siteSetting.upsert({
      where: { key: s.key },
      update: { value: s.value, description: s.description },
      create: { key: s.key, value: s.value, description: s.description },
    });
  }
  console.log("✅ Đã nạp cấu hình hệ thống Logistics GT chính xác 100%");

  // 3. Nạp danh mục Dịch vụ Logistics GT với ảnh thực tế và tên ngắn gọn, tinh tế
  const defaultServices = [
    {
      title: "Vận tải đường bộ",
      slug: "van-tai-duong-bo",
      shortDesc: "Chuyên tuyến liên vận xe tải & container qua Cửa khẩu Móng Cái",
      fullContent: `
        <h3>Thế mạnh chuyên tuyến liên vận đường bộ Việt - Trung</h3>
        <p>Công ty TNHH Logistics GT sở hữu mạng lưới phương tiện vận tải đường bộ chuyên nghiệp túc trực thường trực tại khu vực cửa khẩu Móng Cái và cao tốc Vân Đồn - Móng Cái.</p>
        <h4>Năng lực vận chuyển:</h4>
        <ul>
          <li>Vận chuyển container nguyên chuyến (FCL) và gom hàng lẻ (LCL) hai chiều Việt Nam - Đông Hưng (Trung Quốc).</li>
          <li>Đội xe đầu kéo mooc sàn, mooc rào, xe thùng bạt và xe lạnh chuyên chở nông sản xuất khẩu.</li>
          <li>Hỗ trợ bốc xếp, sang tải tại các bãi kiểm hóa Cửa khẩu Bắc Luân 2 và lối mở Km3+4 Hải Yên.</li>
          <li>Giám sát định vị hành trình GPS 24/7, cam kết đúng lịch trình giao nhận.</li>
        </ul>
      `,
      iconName: "Truck",
      bannerImage: "/images/vietphuc/hero_office_panoramic.webp",
      sortOrder: 1,
    },
    {
      title: "Thủ tục hải quan & C/O",
      slug: "thu-tuc-hai-quan",
      shortDesc: "Đại lý thông quan điện tử chính ngạch tại Bắc Luân 2 & Ka Long",
      fullContent: `
        <h3>Dịch vụ khai thuê hải quan chuyên nghiệp tại Móng Cái</h3>
        <p>Với trụ sở nằm ngay sát Cửa khẩu Quốc tế Bắc Luân 2, đội ngũ chuyên viên chứng từ của Logistics GT xử lý trực tiếp tờ khai trên hệ thống VNACCS/VCIS.</p>
        <h4>Phạm vi dịch vụ:</h4>
        <ul>
          <li>Lên tờ khai hải quan điện tử và phân luồng thông quan nhanh (Luồng Xanh, Luồng Vàng, Luồng Đỏ).</li>
          <li>Phối hợp cùng công chức hải quan kiểm hóa thực tế tại bãi kiểm tra tập trung Bắc Luân 2.</li>
          <li>Hỗ trợ xin cấp Giấy chứng nhận xuất xứ hàng hóa C/O Form E hưởng thuế suất ưu đãi đặc biệt ACFTA.</li>
          <li>Đăng ký và lấy mẫu kiểm dịch thực vật, kiểm dịch động vật và kiểm tra an toàn thực phẩm.</li>
        </ul>
      `,
      iconName: "FileCheck",
      bannerImage: "/images/vietphuc/customs_document_review.webp",
      sortOrder: 2,
    },
    {
      title: "Ủy thác xuất nhập khẩu",
      slug: "uy-thac-xuat-nhap-khau",
      shortDesc: "Đàm phán ngoại thương, thanh toán quốc tế và đứng tên tờ khai",
      fullContent: `
        <h3>Giải pháp ủy thác xuất nhập khẩu an toàn & minh bạch</h3>
        <p>Hỗ trợ toàn diện cho các cá nhân, doanh nghiệp chưa có giấy phép XNK hoặc muốn tối ưu hóa thủ tục hành chính, chuyển tiền thanh toán mua bán hàng hóa với đối tác Trung Quốc.</p>
        <h4>Quy trình ủy thác:</h4>
        <ul>
          <li>Đại diện ký hợp đồng ngoại thương với đối tác cung ứng tại Quảng Đông, Chiết Giang, Quảng Tây...</li>
          <li>Hỗ trợ thanh toán quốc tế hợp pháp qua hệ thống ngân hàng thương mại.</li>
          <li>Đứng tên mở tờ khai hải quan nhập khẩu, nộp thuế xuất nhập khẩu và thuế GTGT.</li>
          <li>Xuất hóa đơn GTGT đầy đủ, bàn giao hàng hóa tận kho của Quý khách hàng.</li>
        </ul>
      `,
      iconName: "ShieldCheck",
      bannerImage: "/images/vietphuc/specialist_female_glasses.webp",
      sortOrder: 3,
    },
    {
      title: "Kho bãi & sang tải",
      slug: "kho-bai-chuoi-cung-ung",
      shortDesc: "Hạ tầng kho bãi, xe nâng sang cont và gia cố pallet chuyên nghiệp",
      fullContent: `
        <h3>Hệ thống kho bãi lưu chuyển hàng hóa chiến lược</h3>
        <p>Hệ thống kho bãi rộng lớn, trang bị xe nâng tải trọng lớn, camera an ninh 24/7 và hệ thống phòng cháy chữa cháy đạt chuẩn tại TP. Móng Cái.</p>
        <h4>Tiện ích kho bãi:</h4>
        <ul>
          <li>Lưu kho ngắn hạn và dài hạn chờ ngày thông quan hoặc phân phối nội địa.</li>
          <li>Dịch vụ sang tải, bốc xếp hàng rời, đóng pallet và gia cố kiện gỗ chuyên nghiệp.</li>
          <li>Phân loại hàng hóa, dán nhãn phụ tiếng Việt theo đúng quy định nhãn hàng hóa nhập khẩu.</li>
          <li>Kiểm đếm số lượng, kiểm tra quy cách trước khi giải phóng xe.</li>
        </ul>
      `,
      iconName: "Warehouse",
      bannerImage: "/images/vietphuc/office_main_floor.webp",
      sortOrder: 4,
    },
    {
      title: "Logistics chuỗi lạnh",
      slug: "van-tai-thuy-tuyen-dao",
      shortDesc: "Bảo quản container lạnh phục vụ xuất khẩu nông thủy sản",
      fullContent: `
        <h3>Bảo toàn độ tươi ngon cho nông thủy sản xuất khẩu</h3>
        <p>Cửa khẩu Quốc tế Móng Cái là thủ phủ xuất khẩu nông lâm thủy sản sang thị trường Trung Quốc. Logistics GT cung cấp giải pháp vận tải container lạnh kiểm soát nhiệt độ nghiêm ngặt.</p>
        <h4>Ưu điểm chuỗi lạnh GT:</h4>
        <ul>
          <li>Container lạnh đời mới duy trì dải nhiệt độ từ -25°C đến +15°C ổn định suốt hành trình.</li>
          <li>Máy ghi nhiệt độ tự động kèm báo cáo biểu đồ nhiệt khi bàn giao tại cửa khẩu Đông Hưng.</li>
          <li>Ưu tiên thủ tục thông quan luồng xanh nhanh cho hàng nông sản mau hỏng.</li>
        </ul>
      `,
      iconName: "Ship",
      bannerImage: "/images/vietphuc/presentation_multimodal.webp",
      sortOrder: 5,
    },
    {
      title: "Vận tải đa phương thức",
      slug: "van-tai-da-phuong-thuc",
      shortDesc: "Tích hợp đường bộ, đường biển cảng Hải Phòng và đường sắt",
      fullContent: `
        <h3>Kết nối chuỗi cung ứng logistics khu vực</h3>
        <p>Logistics GT cung cấp giải pháp vận tải tích hợp kết nối từ các khu công nghiệp Bắc Giang, Bắc Ninh, Hải Dương, Hải Phòng đi thẳng tới các tỉnh nội địa Trung Quốc.</p>
        <h4>Mô hình vận tải:</h4>
        <ul>
          <li>Vận tải đường bộ kết hợp cảng biển Hải Phòng (Cảng Đình Vũ, Tân Cảng Lạch Huyện).</li>
          <li>Liên vận đường bộ xuyên biên giới Móng Cái - Đông Hưng đi các tỉnh phía Nam Trung Quốc.</li>
          <li>Điều phối linh hoạt phương tiện phù hợp theo từng mùa vụ cao điểm.</li>
        </ul>
      `,
      iconName: "Globe",
      bannerImage: "/images/vietphuc/boardroom_conference.webp",
      sortOrder: 6,
    },
  ];

  for (const s of defaultServices) {
    await prisma.service.upsert({
      where: { slug: s.slug },
      update: s,
      create: s,
    });
  }
  console.log("✅ Đã nạp 6 dịch vụ Logistics GT với hình ảnh thực tế");

  // 4. Nạp Bài viết Tin tức & Cẩm nang mẫu cho GT Logistics
  const defaultPosts = [
    {
      title: "Quy trình làm thủ tục thông quan hàng hóa qua Cửa khẩu Quốc tế Móng Cái năm 2026",
      slug: "quy-trinh-thong-quan-cua-khau-mong-cai-2026",
      excerpt: "Hướng dẫn chi tiết các bước khai báo hải quan, kiểm hóa tại Cầu Bắc Luân 2, cấp chứng nhận C/O Form E và kinh nghiệm luân chuyển hàng hóa hai chiều Việt - Trung.",
      category: "Cẩm nang XNK",
      coverImage: "/images/vietphuc/customs_document_review.webp",
      content: `
        <p>Cửa khẩu Quốc tế Móng Cái (Quảng Ninh) là cửa ngõ giao thương đường bộ trọng điểm kết nối Việt Nam và các nước ASEAN với thị trường Trung Quốc rộng lớn.</p>
        <h2>1. Những giấy tờ bắt buộc trong bộ hồ sơ thông quan</h2>
        <ul>
          <li>Tờ khai hải quan điện tử in từ hệ thống VNACCS.</li>
          <li>Hóa đơn thương mại (Commercial Invoice) & Bảng kê hàng hóa (Packing List).</li>
          <li>Giấy chứng nhận xuất xứ hàng hóa (C/O Form E) bản gốc để miễn giảm thuế nhập khẩu.</li>
          <li>Giấy chứng nhận kiểm dịch thực vật / kiểm dịch động vật (nếu là nông sản, thực phẩm).</li>
        </ul>
        <h2>2. Lợi thế khi làm thủ tục qua Logistics GT</h2>
        <p>Với văn phòng đặt tại Khu đô thị Vinhomes Golden Avenue (khu vực Cửa khẩu Bắc Luân 2, Móng Cái), Logistics GT hỗ trợ xử lý tờ khai, phối hợp kiểm hóa thực tế tại bãi và giải phóng phương tiện nhanh chóng chỉ trong vài giờ.</p>
      `,
      authorId: adminUser.id,
      isPublished: true,
      viewCount: 340,
    },
    {
      title: "Lợi thế vượt trội của tuyến cao tốc Vân Đồn - Móng Cái đối với chuỗi cung ứng biên mậu",
      slug: "loi-the-cao-toc-van-don-mong-cai",
      excerpt: "Rút ngắn thời gian vận chuyển từ Hà Nội và cụm cảng Hải Phòng đi Móng Cái chỉ còn khoảng 3 giờ, tạo bước đột phá cho hàng nông sản tươi sống và linh kiện điện tử.",
      category: "Tin tức ngành",
      coverImage: "/images/vietphuc/hero_office_panoramic.webp",
      content: `
        <p>Tuyến cao tốc Vân Đồn - Móng Cái kết nối đồng bộ trục cao tốc Hà Nội - Hải Phòng - Hạ Long - Móng Cái đã tạo điều kiện thuận lợi chưa từng có cho hoạt động logistics biên mậu.</p>
        <p>Logistics GT khai thác lịch trình xe chạy hàng ngày, đảm bảo hàng hóa nhận tại Hải Phòng hoặc Hà Nội vào buổi sáng sẽ có mặt tại Móng Cái ngay trong buổi chiều để kịp làm thủ tục thông quan sang Trung Quốc.</p>
      `,
      authorId: adminUser.id,
      isPublished: true,
      viewCount: 220,
    },
    {
      title: "Logistics GT chính thức vận hành trụ sở điều hành hiện đại tại Vinhomes Golden Avenue Móng Cái",
      slug: "khai-truong-tru-so-vinhomes-golden-avenue",
      excerpt: "Logistics GT đưa vào hoạt động văn phòng điều hành khang trang tại Căn ĐLTC-41 KĐT Vinhomes Golden Avenue, Cửa khẩu Bắc Luân 2 với hệ sinh thái đối tác Việt Phúc Logistics.",
      category: "Thông báo công ty",
      coverImage: "/images/vietphuc/gt_brand_wall_illuminated.webp",
      content: `
        <p>Nhằm nâng cao năng lực tiếp đón khách hàng và tối ưu hóa thời gian xử lý thủ tục thông quan tại khu vực Cửa khẩu Bắc Luân 2, <strong>Công ty TNHH Logistics GT</strong> trân trọng thông báo chính thức đưa vào hoạt động trụ sở điều hành mới.</p>
        <p>Văn phòng tọa lạc tại <strong>Căn ĐLTC-41, Khu Đô Thị Vinhomes Golden Avenue, Cửa Khẩu Bắc Luân 2, Phường Hải Hòa, TP. Móng Cái, Tỉnh Quảng Ninh</strong>.</p>
        <p>Tại đây, Logistics GT cùng đơn vị liên kết trong hệ sinh thái là <strong>Công ty TNHH Việt Phúc Logistics</strong> sẵn sàng cung cấp trọn gói các dịch vụ khai báo hải quan, kiểm hóa bãi xe, tư vấn C/O Form E và sang tải xe chuyên nghiệp nhất.</p>
      `,
      authorId: adminUser.id,
      isPublished: true,
      viewCount: 195,
    },
  ];

  for (const p of defaultPosts) {
    await prisma.post.upsert({
      where: { slug: p.slug },
      update: p,
      create: p,
    });
  }
  console.log("✅ Đã nạp 3 bài viết tin tức Logistics GT");

  // 5. Nạp Vận đơn tra cứu mẫu của GT Logistics
  const sampleTrackings = [
    {
      trackingCode: "GT889922",
      customerName: "Công ty TNHH Thương Mại Toàn Cầu Á Châu",
      origin: "KCN Đình Trám, Bắc Giang",
      destination: "Cửa khẩu Quốc tế Móng Cái (Bắc Luân 2)",
      status: "IN_TRANSIT",
      statusLabel: "Đang vận chuyển trên cao tốc Móng Cái",
      currentHub: "Trạm kiểm soát Tiên Yên, Quảng Ninh",
      timelineJson: JSON.stringify([
        { time: "2026-10-31 06:30", location: "KCN Đình Trám, Bắc Giang", desc: "Tiếp nhận 20 tấn linh kiện điện tử lên xe đầu kéo GT-14" },
        { time: "2026-10-31 10:15", location: "Trạm thu phí Tiên Yên", desc: "Xe đã qua trạm kiểm soát an toàn, hướng về Móng Cái" },
        { time: "2026-10-31 14:00", location: "Bãi kiểm hóa Bắc Luân 2", desc: "Chuẩn bị hạ bãi mở tờ khai hải quan điện tử" },
      ]),
    },
    {
      trackingCode: "GT556677",
      customerName: "Công ty CP Nông Sản Xuất Khẩu Việt Xanh",
      origin: "Vùng trồng Lục Ngạn, Bắc Giang",
      destination: "Đông Hưng, Quảng Tây, Trung Quốc",
      status: "DELIVERED",
      statusLabel: "Đã giao hàng và thông quan thành công",
      currentHub: "Kho bãi Logistics GT Móng Cái",
      timelineJson: JSON.stringify([
        { time: "2026-10-29 08:00", location: "Kho bãi GT Móng Cái", desc: "Bốc xếp container lạnh bảo quản nhiệt độ chuẩn" },
        { time: "2026-10-29 11:30", location: "Cửa khẩu Cầu Bắc Luân 2", desc: "Đã thông quan luồng xanh, hoàn tất kiểm dịch thực vật" },
        { time: "2026-10-29 16:45", location: "Bãi nhận hàng Đông Hưng", desc: "Đối tác Trung Quốc đã nghiệm thu và ký biên bản giao nhận" },
      ]),
    },
  ];

  for (const t of sampleTrackings) {
    await prisma.trackingOrder.upsert({
      where: { trackingCode: t.trackingCode },
      update: t,
      create: t,
    });
  }
  console.log("✅ Đã nạp 2 vận đơn tra cứu hành trình mẫu GT Logistics");

  console.log("✨ Hoàn tất nạp dữ liệu Logistics GT lên PostgreSQL!");
}

main()
  .catch((e) => {
    console.error("Lỗi Seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
