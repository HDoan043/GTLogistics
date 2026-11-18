// Dữ liệu mặc định cho Hero Section Trang Chủ
export const DEFAULT_HOME_HERO = {
  titleGt: "CÔNG TY TNHH LOGISTICS GT",
  titleLogistics: "",
  slogan: "ĐỒNG HÀNH TIN CẬY - PHÁT TRIỂN BỀN VỮNG",
  sloganEn: "RELIABLE PARTNER - SUSTAINABLE GROWTH",
  sloganZh: "值得信赖的伙伴 - 可持续发展",
  subHeadline:
    "Đơn vị tiên phong cung cấp giải pháp vận tải đường bộ liên vận Việt - Trung, thông quan chính ngạch tại hệ thống các cửa khẩu trọng điểm phía Bắc (Móng Cái, Hữu Nghị, Tân Thanh, Chi Ma) và khai thác chuyên tuyến Vận tải biển bằng tàu và sà lan đi khắp quần đảo Cô Tô.",
  subHeadlineEn:
    "Pioneering cross-border road transport between Vietnam and China, official customs clearance at key northern border gates (Mong Cai, Huu Nghi, Tan Thanh, Chi Ma), and specialized sea vessel & barge freight across Co To Archipelago.",
  subHeadlineZh:
    "越南北部中越跨境陆运与正规清关领军企业，服务覆盖北仑二桥/卡隆（芒街）、友谊关、新清、峙马四大核心口岸，兼具全境直达姑苏群岛的专业海运驳船船队。",
  btnQuote: "Nhận Báo Giá Trong 15 Phút",
  btnQuoteEn: "Get Quote in 15 Mins",
  btnQuoteZh: "15分钟内极速报价",
  btnHotline: "Hotline Tư Vấn 24/7: 0904.382.268",
  bgImage: "/images/vietphuc/hero_fleet_6k3a8950.webp",
  bgScale: 100,
  bgPosition: "center",
  bgOpacity: 55,
  bullets: [],
};

// Dữ liệu Mạng Lưới Cửa Khẩu Chiến Lược (Border Gate Network)
export const DEFAULT_BORDER_GATES = {
  badge: "MẠNG LƯỚI CỬA KHẨU CHIẾN LƯỢC",
  badgeEn: "STRATEGIC BORDER GATE NETWORK",
  badgeZh: "核心战略口岸网络",
  heading: "Năng Lực Thông Quan Phủ Sóng Toàn Tuyến Biên Giới Phía Bắc",
  headingEn: "Full-Coverage Customs Clearance Along Northern Border Gate Corridors",
  headingZh: "北部边境口岸全线覆盖的专业通关能力",
  description:
    "Không chỉ dừng lại ở một điểm nút, Logistics GT sở hữu đội ngũ nhân sự hiện trường thường trực 24/7 tại tất cả các cửa khẩu huyết mạch Quảng Ninh và Lạng Sơn, đảm bảo luồng hàng hóa thông quan và giải phóng xe ngay trong ngày:",
  descriptionEn:
    "Beyond a single checkpoint, GT Logistics deploys on-site field specialists stationed 24/7 at all vital border gates across Quang Ninh and Lang Son, guaranteeing same-day clearance and rapid vehicle turnaround:",
  descriptionZh:
    "不仅深耕单一节点，GT 物流在广宁省与谅山省所有核心陆路口岸均常驻 24/7 现场报关运营团队，保障中越货物即到即查、当天放行：",
  image: "/images/vietphuc/gt_brand_wall_illuminated.webp",
  gates: [
    {
      code: "01",
      name: "Cửa khẩu Quốc tế Móng Cái (Bắc Luân 2 & Ka Long - Quảng Ninh)",
      nameEn: "Mong Cai International Border Gate (Bac Luan 2 & Ka Long - Quang Ninh)",
      nameZh: "芒街国际口岸（北仑二桥及卡隆口岸 - 广宁省）",
      province: "Quảng Ninh",
      desc: "Đầu mối giao thương tốc độ cao, kết nối trực tiếp Đông Hưng (Trung Quốc) và tuyến cao tốc Vân Đồn – Móng Cái.",
      descEn: "High-speed trade hub directly connecting Dongxing (China) with Van Don - Mong Cai expressway network.",
      descZh: "高速经贸核心枢纽，无缝直通中国东兴口岸并依托云屯—芒街高速公路连接全境各工业区。",
    },
    {
      code: "02",
      name: "Cửa khẩu Quốc tế Hữu Nghị (Lạng Sơn)",
      nameEn: "Huu Nghi International Border Gate (Lang Son)",
      nameZh: "友谊关国际口岸（谅山省）",
      province: "Lạng Sơn",
      desc: "Tuyến huyết mạch đường bộ quan trọng bậc nhất cho hàng điện tử, linh kiện, máy móc công nghiệp và hàng quá cảnh.",
      descEn: "The most vital overland artery for electronics, components, industrial equipment, and customs-bonded transit.",
      descZh: "中越陆路核心运输干道，专营高价值电子元器件、精密工业设备及国际保税过境货物。",
    },
    {
      code: "03",
      name: "Cửa khẩu Tân Thanh (Lạng Sơn)",
      nameEn: "Tan Thanh Border Gate (Lang Son)",
      nameZh: "新清口岸（谅山省）",
      province: "Lạng Sơn",
      desc: "Trung tâm thông quan hàng nông sản, hoa quả tươi sống và hàng tiêu dùng với quy trình kiểm dịch, giải phóng phương tiện nhanh gọn.",
      descEn: "Agricultural, fresh fruit and consumer goods clearance center with streamlined quarantine and fast turnaround.",
      descZh: "农产品、生鲜水果及日用消费品大型集散通关中心，具备动植物检疫绿色通道与快速放行优势。",
    },
    {
      code: "04",
      name: "Cửa khẩu Chi Ma (Lạng Sơn)",
      nameEn: "Chi Ma Border Gate (Lang Son)",
      nameZh: "峙马口岸（谅山省）",
      province: "Lạng Sơn",
      desc: "Giải pháp thông quan tối ưu chi phí và thời gian cho hàng bách hóa, nguyên phụ liệu dệt may (hàng vải) và hàng thương mại biên giới.",
      descEn: "Cost- and time-efficient customs solution for general merchandise, textile fabrics, and border trade.",
      descZh: "综合百货、纺织面料原辅料及边贸互市的高性价比通关方案，大幅压缩等待时间与滞留成本。",
    },
  ],
};

// Dữ liệu mặc định cho Mục Dịch Vụ trên Trang Chủ (4 Dịch Vụ Ma Trận 2x2)
export const DEFAULT_HOME_SERVICES = {
  badge: "HỆ THỐNG DỊCH VỤ TRỌNG TÂM",
  badgeEn: "CORE SERVICES SYSTEM",
  badgeZh: "核心物流服务系统",
  heading: "Giải Pháp Logistics Toàn Diện & Chuyên Sâu",
  headingEn: "Comprehensive & Specialized Logistics Solutions",
  headingZh: "全方位深耕型中越跨境物流综合解决方案",
  description:
    "Từ những lô hàng tiêu chuẩn đến các mặt hàng siêu trường siêu trọng hay vận tải biển đảo phức tạp, GT Logistics đều có phương án xử lý trọn gói.",
  descriptionEn:
    "From standard cargo shipments to oversized project machinery or complex island marine transport, GT Logistics provides complete end-to-end execution.",
  descriptionZh:
    "无论标准进出口集装箱、特种超限工程设备还是复杂的海岛船运，GT 物流均具备全闭环一站式履约能力。",
  illustrationImage: "/images/vietphuc/presentation_multimodal.webp",
};

// Dữ liệu mặc định cho Why Choose Us (1.5)
export const DEFAULT_HOME_WHY_US = {
  badge: "VÌ SAO KHÁCH HÀNG TIN CHỌN",
  badgeEn: "WHY CLIENTS TRUST GT",
  badgeZh: "为何选择我们",
  title: "Vì Sao Khách Hàng Luôn Tin Chọn Logistics GT?",
  titleEn: "Why Do Customers Consistently Choose Logistics GT?",
  titleZh: "为何广大跨国外贸客户长期坚定信赖 GT 物流？",
  description:
    "Chủ động phương tiện vận tải đường bộ và đường biển, phủ sóng 4 cửa khẩu lớn, chuyên gia xử lý hàng khó và cam kết giải phóng hàng ngay trong ngày.",
  descriptionEn:
    "Full ownership of road and sea transport fleets, complete coverage of 4 major border gates, expertise in complex cargo, and same-day clearance commitments.",
  descriptionZh:
    "自营陆运与海岛船队双重掌控、全线覆盖北部四大核心陆路口岸、实战专精难关难货、保障货物快速通关直达交付。",
  image: "/images/vietphuc/boardroom_conference.webp",
  items: [
    {
      icon: "Truck",
      title: "Sở Hữu Trực Tiếp 50 Xe Container & Đội Tàu Sà Lan",
      titleEn: "Direct Ownership of 50 Container Trucks & Marine Fleet",
      titleZh: "直接自营 50 辆集装箱甩挂车队与海运驳船",
      desc: "Chủ động 100% phương tiện đường bộ lẫn đường biển, bình ổn giá cước ngay cả trong mùa cao điểm, không phụ thuộc vào bên trung gian.",
      descEn: "100% control of road and sea transport fleets, stabilizing freight rates even in peak seasons without relying on middlemen.",
      descZh: "自有运力直接调配，旺季运价高度平稳，全程不倒手、无中间环节加价，保障客户运费与时效。",
    },
    {
      icon: "Building",
      title: "Phủ Sóng 4 Cửa Khẩu Lớn",
      titleEn: "Full Coverage of 4 Major Border Gates",
      titleZh: "全面覆盖北部四大核心陆路陆港口岸",
      desc: "Linh hoạt điều phối luồng hàng giữa Móng Cái, Hữu Nghị, Tân Thanh và Chi Ma tùy theo tình trạng thông quan thực tế để giải phóng xe nhanh nhất.",
      descEn: "Flexible cargo rerouting between Mong Cai, Huu Nghi, Tan Thanh, and Chi Ma based on real-time clearance conditions.",
      descZh: "根据当天现场查验排队情况，智能分流通关至芒街、友谊关、新清或峙马，实现车辆极速放行。",
    },
    {
      icon: "ShieldCheck",
      title: "Chuyên Gia Xử Lý Hàng Khó",
      titleEn: "Specialists in Difficult & Specialized Cargo",
      titleZh: "精通大件超限、危险化工与纺织面料等难货处理",
      desc: "Dày dạn kinh nghiệm thực chiến với các lô hàng quá khổ quá tải, hàng quá cảnh, hóa chất nguy hiểm và hàng vải cần kiểm định gấp.",
      descEn: "Proven field experience with project cargo, bonded transit, hazardous chemicals, and urgent textile testings.",
      descZh: "针对超重超长设备、海关监管保税过境、危险化学品申报及服装面料快速抽检出证具备深厚实操功底。",
    },
    {
      icon: "FileCheck",
      title: "Thông Quan Nhanh – Giao Hàng Thẳng",
      titleEn: "Rapid Customs Clearance – Direct Delivery",
      titleZh: "极速报关查验 – 点到点直发客户工厂",
      desc: "Tối ưu hóa thủ tục hải quan để giải phóng hàng ngay tại cửa khẩu và vận chuyển thẳng tới điểm đích, triệt tiêu các chi phí lưu kho bãi không cần thiết cho khách hàng.",
      descEn: "Optimizing customs workflows to release shipments at borders and transport directly to destinations, eliminating unnecessary storage costs.",
      descZh: "优化单证审理与查验衔接，口岸放行后车辆直达收货仓库，彻底杜绝高昂的堆存费与延滞费。",
    },
  ],
};

// Dữ liệu Con Số Năng Lực Ấn Tượng (Chỉ Số Bảo Chứng Năng Lực Doanh Nghiệp)
export const DEFAULT_HOME_STATS = [
  {
    num: "04",
    unit: "CỬA KHẨU",
    label: "Cửa Khẩu Trọng Điểm",
    labelEn: "Key Border Gates",
    labelZh: "大核心战略陆港",
    sub: "Móng Cái – Hữu Nghị – Tân Thanh – Chi Ma",
    subEn: "Mong Cai – Huu Nghi – Tan Thanh – Chi Ma",
    subZh: "芒街 – 友谊关 – 新清 – 峙马现场驻点",
  },
  {
    num: "50+",
    unit: "ĐẦU KÉO",
    label: "Đầu Kéo Container",
    labelEn: "Container Trucks",
    labelZh: "辆自营集装箱车队",
    sub: "Đội xe hùng hậu, vận chuyển giao thẳng không qua trung gian",
    subEn: "Powerful direct fleet, Door-to-Door without middlemen",
    subZh: "自有雄厚车队，点到点直发无需中转",
  },
  {
    num: "ĐỘI TÀU",
    unit: "SÀ LAN",
    label: "Tàu & Sà Lan Biển Đảo",
    labelEn: "Island Marine Vessels",
    labelZh: "海运货船与工程驳船",
    sub: "Kết nối hàng hóa trực tiếp tới tất cả các đảo thuộc Cô Tô",
    subEn: "Direct cargo connectivity to all Co To islands",
    subZh: "货运航线直抵姑苏大岛、小岛与清麟岛",
  },
  {
    num: "100%",
    unit: "CHÍNH NGẠCH",
    label: "Hải Quan Chính Ngạch",
    labelEn: "Official Compliance",
    labelZh: "正规清关申报",
    sub: "Xử lý trọn gói hàng quá khổ quá tải, quá cảnh, hóa chất, hàng vải",
    subEn: "Oversized, transit, chemicals & textile compliance",
    subZh: "全包合规处理超限、过境、化工品与纺织品",
  },
];

// Dữ liệu mặc định cho Trang Giới Thiệu
export const DEFAULT_ABOUT_CONTENT = {
  title: "CÔNG TY TNHH LOGISTICS GT",
  titleEn: "GT LOGISTICS CO., LTD",
  titleZh: "GT 物流有限责任公司",
  subtitle:
    "Đơn vị tiên phong vận tải đường bộ liên vận Việt – Trung, thông quan chính ngạch tại hệ thống các cửa khẩu phía Bắc và khai thác chuyên tuyến tàu/sà lan quần đảo Cô Tô.",
  subtitleEn:
    "Pioneering cross-border road transport Vietnam - China, official customs clearance at northern border gates, and specialized sea vessel/barge freight to Co To islands.",
  subtitleZh:
    "中越跨境公路集装箱联运、北部四大口岸正规通关与广宁姑苏群岛专业海运驳船综合运营服务商.",
  storyImage: "/images/vietphuc/hero_office_panoramic.webp",
  paragraphs: [
    {
      vi: "Được thành lập với sứ mệnh trở thành cầu nối giao thương huyết mạch giữa Việt Nam, Trung Quốc và khu vực ASEAN, Công ty TNHH Logistics GT (MST: 5701750095) đã và đang khẳng định vị thế là một trong những đơn vị tiếp vận biên mậu và vận tải biển đảo uy tín hàng đầu tại miền Bắc.",
      en: "Founded with the mission of connecting vital trade flows between Vietnam, China, and ASEAN, GT Logistics Co., Ltd (Tax Code: 5701750095) affirms its position as a premier cross-border logistics and island marine transport operator.",
      zh: "GT 物流有限责任公司（税号：5701750095）以畅通中越双向经贸及东盟贸易为使命，是越南北部极具信誉的边贸物流与海岛船运领军企业。",
    },
    {
      vi: "Với trụ sở điều hành đặt ngay tại cửa ngõ Cửa khẩu Bắc Luân 2 (KĐT Vinhomes Golden Avenue, TP. Móng Cái), hiện diện trực tiếp tại các cửa khẩu trọng điểm Lạng Sơn (Hữu Nghị, Tân Thanh, Chi Ma), kết hợp cùng năng lực 50 xe đầu kéo container và đội tàu/sà lan chuyên tuyến Cô Tô, chúng tôi mang đến cho doanh nghiệp giải pháp vận chuyển liền mạch từ biên giới trên bộ ra tới tận hải đảo.",
      en: "Headquartered right at Bac Luan 2 Border Gate (Vinhomes Golden Avenue, Mong Cai), directly present at Lang Son border gates (Huu Nghi, Tan Thanh, Chi Ma), equipped with a fleet of 50 container trucks and dedicated Co To island vessels and barges, we deliver seamless logistics from land borders to offshore islands.",
      zh: "总运营部坐落于芒街北仑二桥口岸 Vinhomes Golden Avenue 核心区，全面入驻谅山口岸（友谊关、新清、峙马），依托 50 辆集装箱车队及姑苏海运船队，提供陆海一体化闭环服务。",
    },
  ],
  values: [
    {
      title: "Chính Trực & Chuẩn Pháp Lý",
      titleEn: "Integrity & Full Compliance",
      titleZh: "正规清关与财税合规",
      desc: "100% nghiệp vụ thông quan chính ngạch, xuất hóa đơn GTGT và hồ sơ C/O Form E chuẩn mực theo pháp luật.",
      descEn: "100% official customs clearance, VAT invoicing, and authentic C/O Form E compliance.",
      descZh: "100% 正规通关报关、合规增值税发票与东盟 Form E 原产地证办理。",
    },
    {
      title: "Tốc Độ & Đúng Lịch Trình",
      titleEn: "Speed & On-Time Performance",
      titleZh: "极速查验与准时交付",
      desc: "Chủ động 50 xe container và đội tàu biển đảo, giải phóng xe và thông quan ngay trong ngày.",
      descEn: "Full fleet ownership of 50 container trucks and island barges ensuring same-day release and on-time transit.",
      descZh: "自营 50 辆集装箱车队及姑苏海运驳船，当天查验放行，准时履约。",
    },
    {
      title: "Tận Tâm Phục Vụ 24/7",
      titleEn: "Dedicated 24/7 Field Support",
      titleZh: "24/7 口岸全天候驻点",
      desc: "Đội ngũ chuyên viên thường trực tại Móng Cái, Hữu Nghị, Tân Thanh, Chi Ma và cảng Hải Phòng.",
      descEn: "Field teams stationed 24/7 at Mong Cai, Huu Nghi, Tan Thanh, Chi Ma, and Hai Phong seaport.",
      descZh: "双语专业团队全天候常驻芒街、友谊关、新清、峙马及海防各大枢纽。",
    },
  ],
  companyInfo: {
    taxCode: "5701750095",
    headquarters: "Căn ĐLTC-41, KĐT Vinhomes Golden Avenue, Cửa khẩu Bắc Luân 2, Phường Hải Hòa, TP. Móng Cái, Tỉnh Quảng Ninh",
    history:
      "Được thành lập với sứ mệnh trở thành cầu nối giao thương huyết mạch giữa Việt Nam, Trung Quốc và khu vực ASEAN, Công ty TNHH Logistics GT (MST: 5701750095) đã và đang khẳng định vị thế là một trong những đơn vị tiếp vận biên mậu và vận tải biển đảo uy tín hàng đầu tại miền Bắc.\n\nVới trụ sở điều hành đặt ngay tại cửa ngõ Cửa khẩu Bắc Luân 2 (KĐT Vinhomes Golden Avenue, TP. Móng Cái), hiện diện trực tiếp tại các cửa khẩu trọng điểm Lạng Sơn (Hữu Nghị, Tân Thanh, Chi Ma), kết hợp cùng năng lực 50 xe đầu kéo container và đội tàu/sà lan chuyên tuyến Cô Tô, chúng tôi mang đến cho doanh nghiệp giải pháp vận chuyển liền mạch từ biên giới trên bộ ra tới tận hải đảo.",
  },
  visionMission: {
    vision:
      "Trở thành doanh nghiệp Logistics đa phương thức hàng đầu khu vực phía Bắc, kết nối hoàn hảo giữa vận tải đường bộ biên giới Việt – Trung và vận tải tàu/sà lan biển đảo.",
    mission:
      "Đơn giản hóa mọi thủ tục hải quan phức tạp, cung cấp năng lực vận tải mạnh mẽ cho các mặt hàng đặc thù và công trình biển đảo, giúp đối tác tối ưu chi phí và bứt phá doanh thu.",
  },
  ecosystem: [
    {
      unit: "CÔNG TY TNHH LOGISTICS GT",
      tag: "Công ty mẹ",
      role: "Trung tâm Điều hành & Thủ tục Hải quan",
      desc: "Quản trị chuỗi cung ứng, khai báo hải quan đa cửa khẩu (Móng Cái, Hữu Nghị, Tân Thanh, Chi Ma), xử lý hàng quá khổ quá tải, quá cảnh, hóa chất, vải vóc.",
    },
    {
      unit: "VIỆT PHÚC LOGISTICS",
      tag: "Công ty thành viên",
      role: "Đơn vị Vận tải Đường bộ Liên vận & Nội địa",
      desc: "Trực tiếp quản lý và điều phối đội xe 50 đầu kéo container, kết nối luồng hàng tốc độ cao từ các cửa khẩu Lạng Sơn – Quảng Ninh – Hải Phòng đi toàn quốc.",
    },
    {
      unit: "VẬN TẢI CÔ TÔ",
      tag: "Công ty thành viên",
      role: "Đơn vị Khai thác Tàu & Sà lan Biển Đảo",
      desc: "Vận hành đội tàu biển và sà lan tải trọng lớn, chuyên trách vận chuyển hàng hóa, vật tư công trình đi tất cả các đảo thuộc khu vực Cô Tô, Quảng Ninh.",
    },
  ],
  partners: [
    { name: "Cảng Hải Phòng (Đình Vũ & Lạch Huyện)", category: "Hệ Thống Cảng Biển" },
    { name: "SITC Container Lines", category: "Hãng Tàu Quốc Tế" },
    { name: "COSCO Shipping Lines", category: "Hãng Tàu Quốc Tế" },
    { name: "Foxconn Electronics", category: "Linh Kiện & Điện Tử" },
    { name: "Shenzhou International", category: "Dệt May & Phụ Liệu" },
    { name: "Texhong Textile Group", category: "Nguyên Phụ Liệu Sợi Dệt" },
    { name: "Coteccons Construction", category: "Vật Tư & Công Trình Đảo" },
    { name: "Tập Đoàn Đèo Cả", category: "Hạ Tầng Giao Thông" },
  ],
};

// Dữ liệu mặc định cho Page Banners
export const DEFAULT_BANNERS_CONTENT = {
  about: {
    title: "VỀ CHÚNG TÔI",
    titleEn: "ABOUT US",
    titleZh: "关于我们",
    subtitle:
      "Công ty TNHH Logistics GT - Kết nối thông suốt dòng chảy biên mậu Việt - Trung và vận tải chuyên tuyến biển đảo Cô Tô.",
    subtitleEn:
      "GT Logistics Co., Ltd - Seamless cross-border trade connectivity and specialized Co To island sea freight.",
    subtitleZh:
      "GT 物流有限责任公司 - 畅通中越双向边贸经贸大通道与广宁姑苏海运专线。",
    bgImage: "/images/vietphuc/hero_fleet_6k3a8950.webp",
    bgScale: 100,
    bgPosition: "center",
    bgOpacity: 55,
  },
  services: {
    title: "TẤT CẢ DỊCH VỤ",
    titleEn: "All Services",
    titleZh: "全部物流服务",
    subtitle:
      "Hệ thống giải pháp tiếp vận toàn diện: Thông quan đa cửa khẩu, đội xe 50 container, hàng đặc thù và tàu sà lan Cô Tô.",
    subtitleEn:
      "Comprehensive logistics: multi-border gate clearance, 50-truck container fleet, specialized cargo, and Co To island barges.",
    subtitleZh:
      "四大核心口岸正规报关清关、50辆集装箱直达车队、特种过境货物处理与姑苏群岛船运专线。",
    bgImage: "/images/vietphuc/hero_fleet_6k3a8950.webp",
    bgScale: 100,
    bgPosition: "center",
    bgOpacity: 55,
  },
  news: {
    title: "TIN TỨC & CẨM NANG",
    titleEn: "News & Guides",
    titleZh: "新闻资讯与通关指南",
    subtitle:
      "Cập nhật chính sách biên mậu, biểu thuế xuất nhập khẩu và kinh nghiệm thông quan cửa khẩu mới nhất.",
    subtitleEn:
      "Latest updates on cross-border trade policies, tariffs, and customs procedures at Northern border gates.",
    subtitleZh:
      "实时汇集越南北部各口岸最新外贸政策、海关税率调整与实用清关通关实务经验。",
    bgImage: "/images/vietphuc/hero_fleet_6k3a8950.webp",
    bgScale: 100,
    bgPosition: "center",
    bgOpacity: 55,
  },
  quote: {
    title: "YÊU CẦU BÁO GIÁ NHANH",
    titleEn: "Request a Quote",
    titleZh: "获取快速报价",
    subtitle:
      "Nhận tư vấn phương án vận tải và báo giá cước tối ưu trong vòng 15 phút từ đội ngũ chuyên viên GT Logistics.",
    subtitleEn:
      "Receive freight consultations and optimal rate quotes within 15 minutes from GT Logistics specialists.",
    subtitleZh:
      "15分钟内快速获取专属中越跨境陆运与海岛船运方案及最具竞争力运费报价。",
    bgImage: "/images/vietphuc/hero_fleet_6k3a8950.webp",
    bgScale: 100,
    bgPosition: "center",
    bgOpacity: 55,
  },
  contact: {
    title: "LIÊN HỆ HỢP TÁC",
    titleEn: "Contact Us",
    titleZh: "联系我们",
    subtitle:
      "Kết nối trực tiếp trụ sở Cửa khẩu Bắc Luân 2 Móng Cái, các điểm trực Lạng Sơn, cảng Hải Phòng và đầu mối Cô Tô.",
    subtitleEn:
      "Connect directly with Bac Luan 2 Mong Cai HQ, Lang Son field offices, Hai Phong seaport, and Co To hubs.",
    subtitleZh:
      "直接对接芒街北仑二桥口岸总运营部、谅山各口岸现场工作站、海防大港业务处与姑苏船运联络处。",
    bgImage: "/images/vietphuc/hero_fleet_6k3a8950.webp",
    bgScale: 100,
    bgPosition: "center",
    bgOpacity: 55,
  },
};
