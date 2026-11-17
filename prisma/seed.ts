import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Bắt đầu nạp dữ liệu chuẩn hóa đa ngôn ngữ (VI - EN - ZH) cho LOGISTICS GT lên PostgreSQL Cloud...");

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

  // 3. Nạp danh mục 6 Dịch vụ với nội dung đa ngôn ngữ: Tiếng Việt, Tiếng Anh & Tiếng Trung
  const defaultServices = [
    {
      title: "Vận tải đường bộ",
      titleEn: "Cross-Border Trucking",
      titleZh: "跨境公路运输",
      slug: "van-tai-duong-bo",
      shortDesc: "Chuyên tuyến liên vận xe tải & container qua Cửa khẩu Móng Cái",
      shortDescEn: "Dedicated cross-border trucking & container service via Mong Cai Border Gate",
      shortDescZh: "经由越南芒街口岸的中越跨境卡车与集装箱甩挂直达专线",
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
      fullContentEn: `
        <h3>Cross-Border Road Transport Strengths: Vietnam - China</h3>
        <p>GT Logistics Co., Ltd operates a modern dedicated fleet standing by at Mong Cai Border Gate and Van Don - Mong Cai Expressway.</p>
        <h4>Transportation Capabilities:</h4>
        <ul>
          <li>Full Container Load (FCL) and Less than Container Load (LCL) both ways Vietnam - Dongxing (China).</li>
          <li>Flatbed trailers, stake trucks, box trucks, and reefer containers for agricultural and industrial goods.</li>
          <li>Transshipment and forklift loading support at Bac Luan 2 and Km3+4 Hai Yen inspection yards.</li>
          <li>24/7 real-time GPS fleet monitoring ensuring punctual on-time delivery.</li>
        </ul>
      `,
      fullContentZh: `
        <h3>中越跨境公路运输核心优势</h3>
        <p>GT 物流有限责任公司在越南芒街口岸及云屯—芒街高速公路枢纽常驻专业车队，提供安全快捷的跨境公路甩挂联运保障。</p>
        <h4>核心运力优势：</h4>
        <ul>
          <li>整柜集装箱（FCL）与散货拼箱（LCL）中越双向直通运输（越南—中国东兴/广西各城市）。</li>
          <li>拥有平板半挂车、高栏车、厢式货车及专业冷藏车队，满足农林水产与工业品出口需求。</li>
          <li>在北仑二桥口岸查验场及 Km3+4 海燕通道提供现场理货、叉车过驳与保税转运服务。</li>
          <li>全天候 24/7 GPS 实时轨迹监控，保障货运准时送达。</li>
        </ul>
      `,
      iconName: "Truck",
      bannerImage: "/images/vietphuc/hero_office_panoramic.webp",
      sortOrder: 1,
    },
    {
      title: "Thủ tục hải quan & C/O",
      titleEn: "Customs & C/O Form E",
      titleZh: "海关报关与原产地证",
      slug: "thu-tuc-hai-quan",
      shortDesc: "Đại lý thông quan điện tử chính ngạch tại Bắc Luân 2 & Ka Long",
      shortDescEn: "Official electronic clearance broker at Bac Luan 2 & Ka Long",
      shortDescZh: "北仑二桥及卡隆口岸正贸电子报关与东盟 Form E 代办",
      fullContent: `
        <h3>Dịch vụ đại lý hải quan chính ngạch tại Cửa khẩu Quốc tế Móng Cái</h3>
        <p>Đội ngũ chuyên viên chứng từ của Logistics GT túc trực trực tiếp tại trụ sở Vinhomes Golden Avenue (ngay sát Cửa khẩu Bắc Luân 2), am hiểu sâu sắc quy định kiểm hóa và biểu thuế xuất nhập khẩu.</p>
        <h4>Các hạng mục nghiệp vụ:</h4>
        <ul>
          <li>Khai báo hải quan điện tử qua hệ thống VNACCS/VCIS nhanh chóng, chính xác.</li>
          <li>Xin cấp giấy chứng nhận xuất xứ hàng hóa C/O Form E ưu đãi thuế quan ACFTA.</li>
          <li>Đăng ký và hoàn tất thủ tục kiểm dịch thực vật, kiểm dịch động vật và kiểm tra an toàn thực phẩm.</li>
          <li>Tham vấn giá, phân loại mã HS Code hàng hóa chuẩn xác nhằm tối ưu chi phí thuế.</li>
        </ul>
      `,
      fullContentEn: `
        <h3>Official Customs Brokerage at Mong Cai International Border Gate</h3>
        <p>Our document specialist team operates directly from our Vinhomes Golden Avenue office (adjacent to Bac Luan 2 Gate), possessing deep regulatory knowledge of customs inspections and cross-border tariffs.</p>
        <h4>Key Customs Services:</h4>
        <ul>
          <li>Rapid electronic customs declaration through Vietnam's official VNACCS/VCIS system.</li>
          <li>ACFTA C/O Form E certification application for preferential tariff reduction and exemptions.</li>
          <li>Phytosanitary inspection, veterinary quarantine, and food safety inspection registration.</li>
          <li>Accurate HS code classification and price consultation to minimize import tax liabilities.</li>
        </ul>
      `,
      fullContentZh: `
        <h3>越南芒街国际口岸正规海关报关行服务</h3>
        <p>GT 物流单证团队直驻芒街北仑二桥口岸旁 Vinhomes Golden Avenue，深入掌握中越边贸最新海关查验法规与关税政策。</p>
        <h4>核心业务范围：</h4>
        <ul>
          <li>通过越南 VNACCS/VCIS 电子海关系统快速、精准申报进出口报关单。</li>
          <li>代办中国—东盟自贸区原产地证书（C/O Form E），享受进口关税减免优惠。</li>
          <li>代办动植物卫生检疫证书（Phytosanitary/Veterinary）及食品安全检测。</li>
          <li>海关审价咨询、精准 HS Code 归类，助力外贸企业合法合规降低综合关税成本。</li>
        </ul>
      `,
      iconName: "FileCheck",
      bannerImage: "/images/vietphuc/customs_document_review.webp",
      sortOrder: 2,
    },
    {
      title: "Ủy thác xuất nhập khẩu",
      titleEn: "Trade Entrustment",
      titleZh: "进出口外贸代理",
      slug: "uy-thac-xuat-nhap-khau",
      shortDesc: "Đàm phán ngoại thương, thanh toán quốc tế và đứng tên tờ khai",
      shortDescEn: "Foreign trade negotiation, cross-border payment & declaration",
      shortDescZh: "国际贸易谈判、外汇结算与进出口全流程报关代办",
      fullContent: `
        <h3>Giải pháp ủy thác ngoại thương trọn gói, bảo mật và minh bạch</h3>
        <p>Dành cho các doanh nghiệp, thương nhân chưa có tư cách pháp nhân xuất nhập khẩu hoặc muốn tối ưu hóa nguồn lực nghiệp vụ ngoại thương hai chiều Việt - Trung.</p>
        <h4>Quyền lợi khi hợp tác ủy thác với Logistics GT:</h4>
        <ul>
          <li>Đại diện đứng tên pháp nhân mở tờ khai, ký kết hợp đồng ngoại thương hợp pháp.</li>
          <li>Hỗ trợ thanh toán quốc tế qua ngân hàng chính ngạch (T/T, L/C), bảo đảm an toàn dòng tiền.</li>
          <li>Cung cấp đầy đủ hóa đơn GTGT, chứng từ hợp pháp để quyết toán thuế với cơ quan nhà nước.</li>
          <li>Tư vấn chính sách mặt hàng, giấy phép nhập khẩu chuyên ngành và rào cản kỹ thuật.</li>
        </ul>
      `,
      fullContentEn: `
        <h3>Comprehensive, Secure & Transparent Foreign Trade Entrustment</h3>
        <p>Tailored for enterprises and traders without import-export licenses or looking to streamline cross-border trade operations between Vietnam and China.</p>
        <h4>Benefits of Partnering with GT Logistics:</h4>
        <ul>
          <li>Acting as legal declarant on customs declarations and executing foreign trade contracts.</li>
          <li>Facilitating secure international banking payments (T/T, L/C) with complete regulatory compliance.</li>
          <li>Issuing official VAT tax invoices and accounting documentation for domestic tax clearance.</li>
          <li>Advisory on commodity regulations, specialized import licenses, and technical trade barriers.</li>
        </ul>
      `,
      fullContentZh: `
        <h3>一站式中越外贸代理与清关委托方案</h3>
        <p>专为暂无进出口权、或希望精简外贸单证流程的跨国企业和贸易商量身定制，安全高效。</p>
        <h4>委托 GT 物流的核心权益：</h4>
        <ul>
          <li>以正规法人资质代签外贸购销合同、代办海关报关与外贸单据。</li>
          <li>协助通过正规银行渠道办理国际外汇结算（T/T, L/C），确保资金流转安全合规。</li>
          <li>提供全套合法增值税发票（VAT Invoice）与报关单证，便于财税合规入账。</li>
          <li>提供最新进出口配额、专管许可证及技术性贸易壁垒（TBT）应对咨询。</li>
        </ul>
      `,
      iconName: "ShieldCheck",
      bannerImage: "/images/vietphuc/specialist_female_glasses.webp",
      sortOrder: 3,
    },
    {
      title: "Kho bãi & sang tải",
      titleEn: "Warehousing & Cross-Dock",
      titleZh: "过驳仓储与中转",
      slug: "kho-bai-chuoi-cung-ung",
      shortDesc: "Hạ tầng kho bãi, xe nâng sang cont và gia cố pallet chuyên nghiệp",
      shortDescEn: "Modern bonded storage, forklift cross-docking & palletizing",
      shortDescZh: "高标准仓储堆场、集装箱机械过驳与托盘加固包装",
      fullContent: `
        <h3>Hạ tầng kho bãi và dịch vụ sang tải container tại Móng Cái</h3>
        <p>Logistics GT cung cấp hệ thống kho bãi rộng rãi, trang thiết bị xe nâng hiện đại phục vụ việc sang xe, bốc xếp và lưu kho tạm thời trước khi thông quan.</p>
        <h4>Dịch vụ kho bãi bao gồm:</h4>
        <ul>
          <li>Kho bãi tiêu chuẩn cao, có camera giám sát an ninh 24/7 và hệ thống PCCC đạt chuẩn.</li>
          <li>Dịch vụ sang cont, rút ruột container và bốc xếp hàng hóa cẩn thận, hạn chế tối đa rủi ro móp méo.</li>
          <li>Đóng gói, quấn màng PE, gia cố pallet gỗ theo quy chuẩn xuất khẩu.</li>
          <li>Lưu bãi ngắn hạn và dài hạn với chi phí lưu kho cạnh tranh nhất khu vực cửa khẩu.</li>
        </ul>
      `,
      fullContentEn: `
        <h3>Warehousing Infrastructure & Container Transshipment in Mong Cai</h3>
        <p>GT Logistics operates expansive modern storage facilities and heavy forklift equipment for rapid cross-docking, de-vanning, and temporary warehousing prior to clearance.</p>
        <h4>Warehousing Capabilities:</h4>
        <ul>
          <li>High-standard warehouse facility with 24/7 CCTV surveillance and certified fire protection.</li>
          <li>Container de-stuffing, cross-docking, and careful cargo handling to eliminate transit damage.</li>
          <li>Export-grade palletizing, stretch wrapping, and fumigated wooden crating services.</li>
          <li>Flexible short-term and long-term storage with the most competitive rates at Mong Cai border.</li>
        </ul>
      `,
      fullContentZh: `
        <h3>芒街口岸高标准仓储设施与集装箱过驳服务</h3>
        <p>GT 物流在芒街口岸区域拥有大型仓储中转中心及大吨位叉车装卸设备，为跨境货物提供快速过驳、掏箱及验关前暂存服务。</p>
        <h4>仓储服务涵盖：</h4>
        <ul>
          <li>标准化通风保税仓储，全天候 24/7 高清监控与消防认证，确保货物万无一失。</li>
          <li>快速集装箱掏箱、车对车机械过驳，规范理货装卸，严防货物碰撞破损。</li>
          <li>专业托盘打包、防水缠绕膜加固及出口熏蒸木箱定制包装。</li>
          <li>提供灵活的短期中转与长期仓储方案，享芒街口岸极具竞争力的仓储成本。</li>
        </ul>
      `,
      iconName: "Warehouse",
      bannerImage: "/images/vietphuc/office_main_floor.webp",
      sortOrder: 4,
    },
    {
      title: "Logistics chuỗi lạnh",
      titleEn: "Cold Chain Logistics",
      titleZh: "冷链农产品物流",
      slug: "van-tai-thuy-tuyen-dao",
      shortDesc: "Bảo quản container lạnh phục vụ xuất khẩu nông thủy sản",
      shortDescEn: "Reefer container transport for agricultural & seafood exports",
      shortDescZh: "温控冷藏集装箱运输，服务中越农林生鲜及水海产品",
      fullContent: `
        <h3>Giải pháp logistics chuỗi cung ứng lạnh cho nông thủy sản xuất khẩu</h3>
        <p>Với lợi thế thông quan nhanh tại Cửa khẩu Bắc Luân 2, Logistics GT là đối tác hàng đầu của các doanh nghiệp xuất khẩu trái cây (sầu riêng, thanh long, xoài, mít) và thủy hải sản đông lạnh sang thị trường Trung Quốc.</p>
        <h4>Đặc điểm dịch vụ chuỗi lạnh GT:</h4>
        <ul>
          <li>Dàn xe container lạnh 40 feet thế hệ mới, dải nhiệt độ điều chỉnh từ -25°C đến +15°C.</li>
          <li>Thiết bị giám sát nhiệt độ và độ ẩm liên tục, cung cấp biểu đồ dữ liệu nhiệt độ cho chủ hàng.</li>
          <li>Ưu tiên bố trí luồng thông quan nhanh tại cửa khẩu để đảm bảo độ tươi ngon tuyệt đối của nông sản.</li>
          <li>Dịch vụ cắm điện bảo quản container lạnh tại bãi kiểm hóa trong suốt quá trình chờ thông quan.</li>
        </ul>
      `,
      fullContentEn: `
        <h3>Cold Chain Supply Solutions for Agricultural & Seafood Exports</h3>
        <p>Leveraging fast-track clearance at Bac Luan 2 Gate, GT Logistics is the preferred partner for exporters of tropical fruits (durian, dragon fruit, mango, jackfruit) and frozen seafood bound for China.</p>
        <h4>Cold Chain Highlights:</h4>
        <ul>
          <li>Modern 40-foot reefer container fleet with precision temperature control (-25°C to +15°C).</li>
          <li>Continuous real-time temperature and humidity logging with downloadable charts for cargo owners.</li>
          <li>Priority green-channel customs clearance protocol to preserve peak freshness and shelf life.</li>
          <li>On-site plug-in power stations at inspection yards during customs waiting intervals.</li>
        </ul>
      `,
      fullContentZh: `
        <h3>中越生鲜果蔬与冷冻水产品冷链供应链方案</h3>
        <p>依托北仑二桥口岸农产品绿色通道的通关时效优势，GT 物流是越南热带水果（榴莲、火龙果、芒果、菠萝蜜）及冷冻水产输华核心物流商。</p>
        <h4>GT 冷链核心保障：</h4>
        <ul>
          <li>配备新型 40 尺超温控冷藏集装箱车队，温度可精准调控在 -25°C 至 +15°C 之间。</li>
          <li>全程温湿度传感自动记录，支持货主实时查阅与导出温度温控曲线图表。</li>
          <li>口岸优先报检与查验协同，缩短滞留时间，最大化锁鲜保质。</li>
          <li>在芒街查验堆场提供充足冷插座打冷电源服务，全程不断电保障货品新鲜。</li>
        </ul>
      `,
      iconName: "Ship",
      bannerImage: "/images/vietphuc/presentation_multimodal.webp",
      sortOrder: 5,
    },
    {
      title: "Vận tải đa phương thức",
      titleEn: "Multimodal Transport",
      titleZh: "国际多式联运",
      slug: "van-tai-da-phuong-thuc",
      shortDesc: "Tích hợp đường bộ, đường biển cảng Hải Phòng và đường sắt",
      shortDescEn: "Seamless integration of road, sea freight (Hai Phong) and rail",
      shortDescZh: "整合中越跨境陆运、海防海运大港与铁路网络联运",
      fullContent: `
        <h3>Mạng lưới tiếp vận đa phương thức liên kết Móng Cái - Hải Phòng - Toàn quốc</h3>
        <p>Logistics GT kết hợp linh hoạt giữa vận tải đường bộ cao tốc, vận tải đường biển qua các cảng Hải Phòng và đường sắt liên vận quốc tế nhằm tối ưu hóa chi phí và thời gian giao nhận.</p>
        <h4>Giải pháp đa phương thức:</h4>
        <ul>
          <li>Nhận hàng từ các trung tâm sản xuất (Hà Nội, Bắc Ninh, Bình Dương, Đồng Nai) chuyển về Móng Cái qua đường cao tốc.</li>
          <li>Kết nối hàng nhập khẩu từ Trung Quốc qua Móng Cái rồi chuyển tiếp ra cảng Hải Phòng xuất khẩu đi các nước thứ ba.</li>
          <li>Thủ tục hải quan chuyển cảng, vận chuyển hàng quá cảnh (Transit) an toàn và chuẩn pháp lý.</li>
          <li>Một đầu mối quản lý duy nhất (Single Point of Contact) giúp khách hàng theo dõi trọn vẹn toàn bộ chuỗi luân chuyển.</li>
        </ul>
      `,
      fullContentEn: `
        <h3>Multimodal Logistics Connecting Mong Cai - Hai Phong - Global Routes</h3>
        <p>GT Logistics seamlessly bridges expressway road freight, maritime ocean shipping via Hai Phong deep-water ports, and cross-border rail to optimize both transit times and shipping budgets.</p>
        <h4>Multimodal Features:</h4>
        <ul>
          <li>Cargo collection from major industrial zones (Hanoi, Bac Ninh, Binh Duong) routed swiftly to Mong Cai.</li>
          <li>Transshipment of imports from China through Mong Cai to Hai Phong ports for third-country re-export.</li>
          <li>Official in-transit customs declaration and bonded transit clearance with full regulatory compliance.</li>
          <li>Single Point of Contact management allowing clients to track their entire multi-leg shipment effortlessly.</li>
        </ul>
      `,
      fullContentZh: `
        <h3>联通芒街—海防深水港—越南全境与全球的多式联运</h3>
        <p>GT 物流灵活组合中越高铁/公路货运、越南海防深水港国际海运航线，为跨国供应链提供高性价比的陆海联动大通道。</p>
        <h4>多式联运特色优势：</h4>
        <ul>
          <li>从越南各大制造业基地（河内、北宁、平阳、同奈）快速干线集运至芒街口岸出境。</li>
          <li>中国进口货物经芒街清关后，转运至海防国际港口拼装海运发往欧美及东南亚第三国。</li>
          <li>专业办理国际过境货物转关申报（Transit Customs）与保税货物联运监管手续。</li>
          <li>单一责任主体（Single Point of Contact），全程单一窗口实时追踪货运动态。</li>
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
  console.log("✅ Đã nạp 6 dịch vụ Logistics GT với nội dung đa ngôn ngữ (VI - EN - ZH)");

  // 4. Nạp Bài viết Tin tức & Cẩm nang mẫu cho GT Logistics với nội dung đa ngôn ngữ
  const defaultPosts = [
    {
      title: "Quy trình làm thủ tục thông quan hàng hóa qua Cửa khẩu Quốc tế Móng Cái năm 2026",
      titleEn: "Step-by-Step Customs Clearance Guide at Mong Cai Border Gate in 2026",
      titleZh: "2026年越南芒街国际口岸货物正规报关与快速通关流程指南",
      slug: "quy-trinh-thong-quan-cua-khau-mong-cai-2026",
      excerpt: "Hướng dẫn chi tiết các bước khai báo hải quan, kiểm hóa tại Cầu Bắc Luân 2, cấp chứng nhận C/O Form E và kinh nghiệm luân chuyển hàng hóa hai chiều Việt - Trung.",
      excerptEn: "Comprehensive guide to electronic declaration, inspection at Bac Luan 2 Bridge, ACFTA C/O Form E issuance, and two-way cargo logistics tips.",
      excerptZh: "详解越南芒街北仑二桥电子报关、现场查验、东盟 Form E 原产地证办理及中越双向货物过驳通关实务经验。",
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
      contentEn: `
        <p>Mong Cai International Border Gate is a vital terrestrial commercial corridor connecting Vietnam and ASEAN economies with the vast Chinese market.</p>
        <h2>1. Mandatory Documents in the Customs Clearance Dossier</h2>
        <ul>
          <li>Electronic customs declaration printout from the VNACCS system.</li>
          <li>Commercial Invoice and Packing List.</li>
          <li>Original Certificate of Origin (ACFTA C/O Form E) for preferential tariff exemptions.</li>
          <li>Phytosanitary or veterinary quarantine certificates (for agricultural and seafood items).</li>
        </ul>
        <h2>2. Strategic Advantages with GT Logistics</h2>
        <p>Located directly at Vinhomes Golden Avenue near Bac Luan 2 Gate, GT Logistics expedites document processing, onsite physical inspections, and ensures same-day vehicle release within hours.</p>
      `,
      contentZh: `
        <p>越南芒街国际口岸（广宁省）是连接越南乃至东盟各国与中国庞大经贸市场的陆路桥头堡枢纽。</p>
        <h2>一、正规海关报关必备单证清单</h2>
        <ul>
          <li>经由越南 VNACCS 电子海关系统申报并打印的正式报关单。</li>
          <li>商业发票（Commercial Invoice）与装箱单（Packing List）。</li>
          <li>中国—东盟自贸区原产地证书正本（C/O Form E），享受进口零关税优惠。</li>
          <li>官方动植物检疫证书与卫生检疫证明（针对农林生鲜及冷冻水产）。</li>
        </ul>
        <h2>二、选择 GT 物流办理口岸通关的核心优势</h2>
        <p>GT 物流办公室直驻北仑二桥口岸旁 Vinhomes Golden Avenue，单证团队与海关查验人员实时联动，实现当天查验、迅速放行，大幅降低货物滞港滞车费用。</p>
      `,
      authorId: adminUser.id,
      isPublished: true,
      viewCount: 340,
    },
    {
      title: "Lợi thế vượt trội của tuyến cao tốc Vân Đồn - Móng Cái đối với chuỗi cung ứng biên mậu",
      titleEn: "Van Don - Mong Cai Expressway: Breakthrough for Cross-Border Supply Chains",
      titleZh: "云屯—芒街高速公路通车为中越跨境供应链带来的跨越式发展机遇",
      slug: "loi-the-cao-toc-van-don-mong-cai",
      excerpt: "Rút ngắn thời gian vận chuyển từ Hà Nội và cụm cảng Hải Phòng đi Móng Cái chỉ còn khoảng 3 giờ, tạo bước đột phá cho hàng nông sản tươi sống và linh kiện điện tử.",
      excerptEn: "Slashing transit time from Hanoi and Hai Phong seaport cluster to Mong Cai to just 3 hours, empowering perishables and high-tech electronics.",
      excerptZh: "将河内及海防深水港至芒街口岸的货运车程缩短至仅3小时，为中越生鲜果蔬冷链及高附加值电子零配件带来质的飞跃。",
      category: "Tin tức ngành",
      coverImage: "/images/vietphuc/hero_office_panoramic.webp",
      content: `
        <p>Tuyến cao tốc Vân Đồn - Móng Cái kết nối đồng bộ trục cao tốc Hà Nội - Hải Phòng - Hạ Long - Móng Cái đã tạo điều kiện thuận lợi chưa từng có cho hoạt động logistics biên mậu.</p>
        <p>Logistics GT khai thác lịch trình xe chạy hàng ngày, đảm bảo hàng hóa nhận tại Hải Phòng hoặc Hà Nội vào buổi sáng sẽ có mặt tại Móng Cái ngay trong buổi chiều để kịp làm thủ tục thông quan sang Trung Quốc.</p>
      `,
      contentEn: `
        <p>The Van Don - Mong Cai expressway seamlessly links the Hanoi - Hai Phong - Ha Long - Mong Cai corridor, creating unprecedented speed for border logistics.</p>
        <p>GT Logistics operates scheduled daily runs, guaranteeing that cargo picked up in Hai Phong or Hanoi in the morning reaches Mong Cai by the afternoon for prompt clearance into China.</p>
      `,
      contentZh: `
        <p>云屯—芒街高速公路全线贯通，无缝对接河内—海防—下龙全高速通道，为中越边境跨境物流带来了前所未有的时效红利。</p>
        <p>GT 物流执行每日定点发车班次，确保上午在海防港或河内工厂装车的货物，下午即可抵达芒街口岸并即时衔接出境报关手续。</p>
      `,
      authorId: adminUser.id,
      isPublished: true,
      viewCount: 220,
    },
    {
      title: "Logistics GT chính thức vận hành trụ sở điều hành hiện đại tại Vinhomes Golden Avenue Móng Cái",
      titleEn: "GT Logistics Commences Operations at Vinhomes Golden Avenue Mong Cai HQ",
      titleZh: "GT 物流正式启用越南芒街 Vinhomes Golden Avenue 现代化口岸运营中心",
      slug: "khai-truong-tru-so-vinhomes-golden-avenue",
      excerpt: "Logistics GT đưa vào hoạt động văn phòng điều hành khang trang tại Căn ĐLTC-41 KĐT Vinhomes Golden Avenue, Cửa khẩu Bắc Luân 2 với hệ sinh thái đối tác Việt Phúc Logistics.",
      excerptEn: "GT Logistics launches its state-of-the-art office at Unit DLTC-41, Vinhomes Golden Avenue, Bac Luan 2 Gate in partnership with Viet Phuc Logistics.",
      excerptZh: "GT 物流位于芒街北仑二桥口岸 Vinhomes Golden Avenue DLTC-41 单元的现代化运营大楼正式投用，携手越福物流打造中越一站式服务生态。",
      category: "Thông báo công ty",
      coverImage: "/images/vietphuc/gt_brand_wall_illuminated.webp",
      content: `
        <p>Nhằm nâng cao năng lực tiếp đón khách hàng và tối ưu hóa thời gian xử lý thủ tục thông quan tại khu vực Cửa khẩu Bắc Luân 2, <strong>Công ty TNHH Logistics GT</strong> trân trọng thông báo chính thức đưa vào hoạt động trụ sở điều hành mới.</p>
        <p>Văn phòng tọa lạc tại <strong>Căn ĐLTC-41, Khu Đô Thị Vinhomes Golden Avenue, Cửa Khẩu Bắc Luân 2, Phường Hải Hòa, TP. Móng Cái, Tỉnh Quảng Ninh</strong>.</p>
        <p>Tại đây, Logistics GT cùng đơn vị liên kết trong hệ sinh thái là <strong>Công ty TNHH Việt Phúc Logistics</strong> sẵn sàng cung cấp trọn gói các dịch vụ khai báo hải quan, kiểm hóa bãi xe, tư vấn C/O Form E và sang tải xe chuyên nghiệp nhất.</p>
      `,
      contentEn: `
        <p>To enhance customer reception and expedite customs clearance turnaround at Bac Luan 2 International Gate, <strong>GT Logistics Co., Ltd</strong> is pleased to announce the inauguration of our new operations headquarters.</p>
        <p>Located at <strong>Unit DLTC-41, Vinhomes Golden Avenue, Bac Luan 2 International Border Gate, Hai Hoa Ward, Mong Cai City, Quang Ninh Province</strong>.</p>
        <p>Together with our ecosystem partner <strong>Viet Phuc Logistics Co., Ltd</strong>, we deliver complete solutions in customs brokering, yard tallying, C/O Form E consulting, and heavy freight transshipment.</p>
      `,
      contentZh: `
        <p>为进一步提升客户跨境接待体验、缩减北仑二桥口岸报关查验与放行流转时间，<strong>GT 物流有限责任公司</strong>隆重宣布芒街新运营总部正式投入使用。</p>
        <p>新总部坐落于<strong>越南广宁省芒街市海和坊北仑二桥口岸 Vinhomes Golden Avenue 商业区 DLTC-41 单元</strong>。</p>
        <p>在此，GT 物流携手生态战略合作伙伴<strong>越福物流有限责任公司（Viet Phuc Logistics）</strong>，为广大中越客商提供进出口报关申报、查验协同、东盟 Form E 原产地证办理及过驳仓储全方位服务。</p>
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
  console.log("✅ Đã nạp 3 bài viết tin tức Logistics GT đa ngôn ngữ");

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

  console.log("✨ Hoàn tất nạp dữ liệu Logistics GT đa ngôn ngữ lên PostgreSQL!");
}

main()
  .catch((e) => {
    console.error("Lỗi Seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
