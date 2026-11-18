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

  // 3. Nạp danh mục 4 Dịch vụ chính thức theo tài liệu cốt lõi (VI - EN - ZH)
  // Xóa các dịch vụ cũ không còn phù hợp để giữ hệ thống sạch 100%
  await prisma.service.deleteMany({});

  const defaultServices = [
    {
      title: "Khai Báo Hải Quan & Thông Quan Cửa Khẩu",
      titleEn: "Customs Brokerage & Clearance",
      titleZh: "报关与口岸清关服务",
      slug: "khai-bao-hai-quan-thong-quan",
      shortDesc: "Đại lý hải quan điện tử chính ngạch trực tiếp tại Móng Cái, Hữu Nghị, Tân Thanh, Chi Ma",
      shortDescEn: "Official electronic customs broker at Mong Cai, Huu Nghi, Tan Thanh, Chi Ma",
      shortDescZh: "在芒街、友谊关、新清、峙马等口岸提供正贸电子报关与东盟 Form E 原产地证代办",
      fullContent: `
        <h3>Đại lý hải quan điện tử chính ngạch tại các cửa khẩu trọng điểm phía Bắc</h3>
        <p>Công ty TNHH Logistics GT sở hữu đội ngũ nhân sự hiện trường thường trực 24/7 trực tiếp tại <strong>Cửa khẩu Quốc tế Móng Cái (Bắc Luân 2 & Ka Long), Cửa khẩu Quốc tế Hữu Nghị, Tân Thanh và Chi Ma</strong>, am hiểu sâu sắc quy định kiểm hóa, chính sách quản lý chuyên ngành và biểu thuế xuất nhập khẩu.</p>
        <h4>Năng lực nghiệp vụ cốt lõi:</h4>
        <ul>
          <li><strong>Đại lý hải quan điện tử chính ngạch:</strong> Thực hiện khai báo truyền tờ khai VNACCS/VCIS nhanh chóng, tiếp nhận luồng tờ khai (Xanh, Vàng, Đỏ) và phối hợp kiểm hóa hiện trường ngay trong ngày.</li>
          <li><strong>Tư vấn chuẩn hóa bộ chứng từ XNK:</strong> Rà soát Hợp đồng thương mại, Invoice, Packing List, Vận đơn; tra cứu mã HS Code chuẩn xác nhằm tối ưu biểu thuế và phòng ngừa rủi ro tham vấn giá.</li>
          <li><strong>Xin cấp & Kiểm tra C/O Form E (ACFTA):</strong> Xin cấp và thẩm định tính hợp lệ của chứng nhận xuất xứ Form E để doanh nghiệp hưởng thuế suất nhập khẩu 0% hoặc ưu đãi đặc biệt.</li>
          <li><strong>Thực hiện trọn gói mọi loại hình XNK:</strong> Nhập kinh doanh tiêu dùng (A11), Nhập nguyên liệu sản xuất xuất khẩu (E31), Gia công hàng may mặc & điện tử (E21), Tạm nhập tái xuất (G11/G21), Hàng tạo tài sản cố định đầu tư miễn thuế.</li>
          <li><strong>Kiểm tra chuyên ngành:</strong> Đăng ký kiểm dịch thực vật, kiểm dịch động vật, kiểm tra an toàn thực phẩm, công bố hợp quy và kiểm định hàm lượng Formaldehyt cho vải dệt may.</li>
        </ul>
      `,
      fullContentEn: `
        <h3>Official Customs Brokerage at Key Northern Border Gates</h3>
        <p>GT Logistics deploys on-site customs specialists operating 24/7 directly at <strong>Mong Cai (Bac Luan 2 & Ka Long), Huu Nghi, Tan Thanh, and Chi Ma Border Gates</strong>.</p>
        <h4>Core Customs Capabilities:</h4>
        <ul>
          <li>Official electronic clearance via Vietnam's official VNACCS/VCIS system with rapid same-day release.</li>
          <li>Accurate HS code classification, tariff optimization, and valuation audit risk mitigation.</li>
          <li>ACFTA C/O Form E application and authenticity verification for preferential tariff exemptions.</li>
          <li>Comprehensive trade regimes: Commercial import (A11), Manufacturing export (E31), Inward processing (E21), Temporary import for re-export, and duty-free investment assets.</li>
          <li>Specialized inspections: Phytosanitary, veterinary quarantine, food safety, and textile conformity assessments.</li>
        </ul>
      `,
      fullContentZh: `
        <h3>北部四大核心陆路口岸正规海关报关与清关行服务</h3>
        <p>GT 物流在<strong>芒街（北仑二桥与卡隆）、友谊关、新清、峙马</strong>等陆路口岸常驻 24/7 现场专业单证与查验团队。</p>
        <h4>核心业务优势：</h4>
        <ul>
          <li>通过越南 VNACCS/VCIS 电子海关系统极速申报，当天完成现场理货查验放行。</li>
          <li>精准 HS Code 归类、最优进出口关税筹划及海关审价合规咨询。</li>
          <li>代办与核验中国—东盟自贸区原产地证书（C/O Form E），合规享受关税减免。</li>
          <li>涵盖一般贸易正贸进口（A11）、进料加工（E31）、来料加工（E21）、暂进再出及免税投资设备。</li>
          <li>代办动植物检疫、食品安全检测及服装面料快速检测出证。</li>
        </ul>
      `,
      iconName: "FileCheck",
      bannerImage: "/images/vietphuc/customs_document_review.webp",
      sortOrder: 1,
    },
    {
      title: "Vận Tải Đường Bộ Việt – Trung (Đội Xe 50 Chiếc Container)",
      titleEn: "Cross-Border Trucking (50 Fleet)",
      titleZh: "中越跨境公路集装箱运输（50辆车队）",
      slug: "van-tai-duong-bo-viet-trung",
      shortDesc: "Sở hữu đội xe 50 đầu kéo container, vận chuyển giao thẳng Door-to-Door không qua trung gian",
      shortDescEn: "Owned fleet of 50 container trucks delivering direct Door-to-Door without intermediaries",
      shortDescZh: "拥有50辆集装箱牵引车队，点到点极速直达交付，节省仓储与滞期成本",
      fullContent: `
        <h3>Năng lực vận tải đường bộ vượt trội với đội xe trực tiếp 50 đầu kéo container</h3>
        <p>Thông qua sự liên kết chặt chẽ với đơn vị thành viên <strong>Việt Phúc Logistics</strong>, Logistics GT tự hào trực tiếp sở hữu và điều hành mạng lưới <strong>50 xe đầu kéo container</strong> hiện đại, chuyên tuyến liên vận hai chiều Việt Nam – Trung Quốc.</p>
        <h4>Ưu thế vận tải đường bộ:</h4>
        <ul>
          <li><strong>Đội ngũ phương tiện hùng hậu:</strong> 50 đầu kéo chuyên dụng kéo các loại vỏ cont 20ft, 40ft, 45ft, mooc sàn, mooc lùn, mooc rào đáp ứng mọi tải trọng và kích thước hàng hóa.</li>
          <li><strong>Vận chuyển giao thẳng (Door-to-Door):</strong> Tối ưu hóa quy trình điều vận để lấy hàng ngay tại bãi cửa khẩu (Móng Cái, Lạng Sơn) và giao thẳng về kho xưởng/nhà máy của khách hàng trên toàn quốc, loại bỏ khâu bốc dỡ trung gian.</li>
          <li><strong>Tiết kiệm tối đa chi phí:</strong> Triệt tiêu chi phí lưu ca xe, phí bến bãi và phí sang tải không cần thiết, giúp doanh nghiệp tiết kiệm từ 15% - 25% tổng chi phí logistics.</li>
          <li><strong>Giám sát hành trình GPS 24/7:</strong> Cập nhật vị trí, vận tốc và trạng thái xe theo thời gian thực, cam kết giao hàng an toàn, đúng giờ và bảo hiểm 100% trách nhiệm hàng hóa.</li>
        </ul>
      `,
      fullContentEn: `
        <h3>Cross-Border Road Transport with 50 Direct Container Trucks</h3>
        <p>Through our affiliate <strong>Viet Phuc Logistics</strong>, GT Logistics directly owns and operates a modern fleet of <strong>50 container trucks</strong> serving two-way Vietnam - China trade routes.</p>
        <h4>Key Road Freight Advantages:</h4>
        <ul>
          <li>Robust fleet: 50 heavy-duty tractor units pulling 20ft, 40ft, 45ft boxes, flatbeds, lowboys, and stake trailers.</li>
          <li>Door-to-Door direct delivery: picking up cargo directly from border yards and transporting straight to client factories without intermediate handling.</li>
          <li>Cost optimization: eliminating unnecessary demurrage, yard detention, and double handling costs.</li>
          <li>24/7 GPS fleet monitoring ensuring safe, reliable, and punctual transit with 100% liability insurance.</li>
        </ul>
      `,
      fullContentZh: `
        <h3>自营50辆集装箱甩挂车队的中越跨境公路运力</h3>
        <p>依托成员企业<strong>越福物流（Viet Phuc Logistics）</strong>，GT 物流直接掌控并运营 <strong>50 辆现代化集装箱牵引车</strong>，深耕中越双向跨境陆运通道。</p>
        <h4>核心运力优势：</h4>
        <ul>
          <li>拥有 50 辆大功率牵引车，配备 20尺、40尺、45尺集装箱底盘、平板半挂及低平板车。</li>
          <li>门到门点到点直发（Door-to-Door）：口岸清关放行后直接发运至客户工厂，免除二次倒箱中转。</li>
          <li>最大化降低物流成本：杜绝不必要的堆存费、压夜费与过驳费，综合成本降低 15% - 25%。</li>
          <li>24/7 GPS 全程实时在途轨迹监管，保障货物安全与精准履约。</li>
        </ul>
      `,
      iconName: "Truck",
      bannerImage: "/images/vietphuc/hero_office_panoramic.webp",
      sortOrder: 2,
    },
    {
      title: "Vận Chuyển & Thông Quan Hàng Hóa Đặc Thù",
      titleEn: "Specialized & Transit Cargo",
      titleZh: "特种货物与过境货物运输",
      slug: "van-chuyen-hang-dac-thu",
      shortDesc: "Chuyên gia hàng quá khổ quá tải, hàng quá cảnh kẹp chì, hóa chất và kiểm định vải may mặc",
      shortDescEn: "Specialist for OOG cargo, bonded transit seals, chemical permits and textile inspections",
      shortDescZh: "专业处理超限大件工程设备、海关监管过境货物、化学品安全审批及服装面料快速检测",
      fullContent: `
        <h3>Thế mạnh cốt lõi: Giải pháp chuyên biệt cho các mặt hàng khó & phức tạp</h3>
        <p>Logistics GT là đơn vị tiếp vận hiếm hoi tại cửa ngõ phía Bắc sở hữu năng lực thực chiến chuyên sâu với các loại hàng hóa đặc thù đòi hỏi tiêu chuẩn kỹ thuật và pháp lý khắt khe nhất.</p>
        <h4>4 nhóm hàng hóa thế mạnh:</h4>
        <ul>
          <li><strong>Hàng quá khổ, quá tải (OOG / Project Cargo):</strong> Vận chuyển dây chuyền máy móc nhà máy công nghiệp, thiết bị công trình xây dựng, dầm thép và kết cấu siêu trường siêu trọng bằng đội xe Mooc lùn, Mooc rút chuyên dụng; khảo sát tuyến đường và xin giấy phép lưu hành đặc biệt.</li>
          <li><strong>Hàng quá cảnh (Transit Cargo):</strong> Khai báo thủ tục hải quan vận chuyển độc lập, kẹp chì niêm phong điện tử xuyên biên giới (Trung Quốc ⇄ Việt Nam ⇄ Lào / Campuchia / Thái Lan và trung chuyển qua cụm Cảng biển Hải Phòng).</li>
          <li><strong>Hàng hóa chất & Hàng nguy hiểm (DG):</strong> Tư vấn xin giấy phép tiền chất công nghiệp, khai báo hóa chất trực tuyến qua Cổng thông tin một cửa quốc gia, kiểm tra bảng chỉ dẫn an toàn hóa chất MSDS và vận chuyển bằng phương tiện đạt chứng chỉ an toàn phòng cháy chữa cháy.</li>
          <li><strong>Hàng vải & Nguyên phụ liệu dệt may:</strong> Thông quan nhanh số lượng lớn hàng trăm container vải cuộn mỗi tháng; phối hợp các trung tâm kiểm định xử lý nhanh thủ tục kiểm tra chuyên ngành hàm lượng Formaldehyt và amin thơm, đảm bảo nguyên liệu kịp thời cho dây chuyền xưởng may.</li>
        </ul>
      `,
      fullContentEn: `
        <h3>Core Strength: Specialized Logistics for High-Complexity Cargo</h3>
        <p>GT Logistics is one of the very few border logistics operators with deep technical mastery in handling demanding and heavily regulated cargo categories.</p>
        <h4>4 Core Specialized Categories:</h4>
        <ul>
          <li>Oversized & Overweight (OOG / Project Cargo): Industrial assembly lines, construction heavy machinery, steel structures via specialized lowboy trailers with official route survey permits.</li>
          <li>Bonded Transit Cargo: In-transit declarations with electronic customs seals connecting China ⇄ Vietnam ⇄ Laos/Cambodia/Thailand and Hai Phong maritime seaports.</li>
          <li>Chemicals & Dangerous Goods (DG): Industrial precursor permits, MSDS evaluation, national single-window chemical declarations, and safety-certified transport.</li>
          <li>Textiles & Fabrics: High-volume rapid customs clearance, specialized Formaldehyde and aromatic amine testing coordination for apparel factories.</li>
        </ul>
      `,
      fullContentZh: `
        <h3>核心技术优势：攻克高难度特殊品类进出口与通关</h3>
        <p>GT 物流在越南北部边境口岸具备处理各类高门槛、高技术规范特殊货物的成熟实操经验。</p>
        <h4>四大特色攻坚品类：</h4>
        <ul>
          <li>超限大件设备（OOG / Project Cargo）：整套工业流水线、大型工程设备、特种钢构，配备超低平板拖车与特种道路通行许可。</li>
          <li>海关监管过境货物（Transit Cargo）：办理独立转关与海关电子封条，贯通中越老柬泰五国内陆与海防港国际出海口。</li>
          <li>危险化学品申报与储运：代办工业前体化学品许可证、MSDS 审核及国家单一窗口化学品合规申报。</li>
          <li>服装面料原辅料快清：海量面料集装箱极速清关，专人跟进甲醛及可分解芳香胺染料快速质检出证，保障服装厂生产工期。</li>
        </ul>
      `,
      iconName: "ShieldCheck",
      bannerImage: "/images/vietphuc/presentation_multimodal.webp",
      sortOrder: 3,
    },
    {
      title: "Vận Tải Biển Bằng Tàu & Sà Lan Đi Tất Cả Các Đảo Cô Tô",
      titleEn: "Co To Island Sea & Barge Freight",
      titleZh: "姑苏群岛船运与驳船海运专线",
      slug: "van-tai-bien-dao-co-to",
      shortDesc: "Đội tàu và sà lan tải trọng lớn chuyên chở vật liệu xây dựng, thiết bị dự án ra các đảo thuộc Cô Tô",
      shortDescEn: "Large tonnage vessels and barges transporting building materials and project cargo to Co To",
      shortDescZh: "运力涵盖建材（沙石水泥钢材）、工程机械设备及民生物资直达姑苏大岛、小岛与清麟岛",
      fullContent: `
        <h3>Mạng lưới tàu biển & sà lan chuyên tuyến đi khắp quần đảo Cô Tô</h3>
        <p>Thông qua đơn vị thành viên <strong>Vận Tải Cô Tô</strong>, Logistics GT là đơn vị tiên phong cung cấp giải pháp vận tải đường biển chuyên dụng kết nối từ các bến cảng đất liền (Vân Đồn, Cẩm Phả) ra <strong>tất cả các đảo thuộc huyện đảo Cô Tô</strong>.</p>
        <h4>Năng lực vận chuyển đường thủy biển đảo:</h4>
        <ul>
          <li><strong>Đội phương tiện thủy trọng tải lớn:</strong> Khai thác đội tàu biển chuyên dụng và sà lan boong/sà lan tự hành công suất cao, thích ứng hoàn hảo với điều kiện luồng lạch, sóng gió đặc thù vùng biển Đông Bắc.</li>
          <li><strong>Chuyên chở đa dạng chủng loại hàng:</strong> Vận chuyển vật liệu xây dựng khối lượng lớn (cát, đá, xi măng, sắt thép), máy móc công trình cơ giới (máy xúc, xe lu, xe trộn bê tông), thiết bị dự án hạ tầng điện nước biển đảo.</li>
          <li><strong>Phục vụ dân sinh & du lịch:</strong> Tiếp vận lương thực, thực phẩm, hàng bách hóa tiêu dùng, đồ nội thất và trang thiết bị phục vụ các khu nghỉ dưỡng, khách sạn trên đảo.</li>
          <li><strong>Bến bãi bốc xếp chuyên nghiệp:</strong> Cung cấp thiết bị cẩu tải trọng nặng tại cảng đất liền và bãi tập kết tại các đảo (Cô Tô Lớn, Cô Tô Con, Thanh Lân), đảm bảo an toàn tuyệt đối cho hàng hóa.</li>
        </ul>
      `,
      fullContentEn: `
        <h3>Dedicated Marine Vessels & Barges Across Co To Archipelago</h3>
        <p>Through our dedicated affiliate <strong>Van Tai Co To</strong>, GT Logistics pioneers maritime heavy barge logistics connecting mainland ports (Van Don, Cam Pha) to <strong>every island in the Co To Archipelago</strong>.</p>
        <h4>Island Marine Transport Capabilities:</h4>
        <ul>
          <li>Heavy marine fleet: high-tonnage cargo vessels and motorized deck barges engineered for northeastern coastal maritime conditions.</li>
          <li>Bulk cargo handling: bulk construction materials (sand, gravel, cement, rebar), heavy engineering vehicles (excavators, rollers), and island utilities infrastructure gear.</li>
          <li>Commercial & tourist supplies: consumer goods, fresh groceries, furnishings, and equipment for island resorts and hospitality sectors.</li>
          <li>Professional pier loading & handling: high-capacity crane services at mainland terminals and direct island offloading across Big Co To, Small Co To, and Thanh Lan.</li>
        </ul>
      `,
      fullContentZh: `
        <h3>直通广宁省姑苏群岛全境的货运轮船与工程驳船专线</h3>
        <p>依托成员企业<strong>姑苏海运（Van Tai Co To）</strong>，GT 物流独家开辟从内陆港口（云屯、锦普）直达<strong>姑苏群岛所有岛屿</strong>的专业海运驳船航线。</p>
        <h4>海岛海运核心运力：</h4>
        <ul>
          <li>大吨位特种海运船队：高载重货运轮船与自航甲板驳船，适应东北海域潮汐水文与风浪条件。</li>
          <li>全品类大宗物资承运：大宗工程建材（黄沙、碎石、水泥、螺纹钢）、重型施工机械车辆（挖掘机、压路机、水泥罐车）及海岛电水基建设备。</li>
          <li>保障民生与海岛旅游：运送生鲜粮油、商超日用品、酒店工程家电及度假村配套物资。</li>
          <li>陆岛两端专业码头吊装：陆上枢纽码头重型吊车过驳装船，姑苏大岛、姑苏小岛与清麟岛无缝过驳抵港。</li>
        </ul>
      `,
      iconName: "Ship",
      bannerImage: "/images/vietphuc/boardroom_conference.webp",
      sortOrder: 4,
    },
  ];

  for (const s of defaultServices) {
    await prisma.service.upsert({
      where: { slug: s.slug },
      update: s,
      create: s,
    });
  }
  console.log("✅ Đã nạp 4 dịch vụ chính thức Logistics GT với nội dung đa ngôn ngữ (VI - EN - ZH)");

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
