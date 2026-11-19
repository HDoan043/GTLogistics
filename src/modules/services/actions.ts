"use server";

import { prisma } from "@/lib/db";
import { SERVICE_CATEGORIES } from "@/lib/constants";
import { unstable_cache, revalidateTag } from "next/cache";

const OFFICIAL_SERVICE_DETAILS: Record<
  string,
  {
    fullContent: string;
    fullContentEn: string;
    fullContentZh: string;
  }
> = {
  "khai-bao-hai-quan-thong-quan": {
    fullContent: `
      <h3>Đại lý hải quan điện tử chính ngạch tại các cửa khẩu trọng điểm phía Bắc</h3>
      <p>Công ty TNHH Logistics GT sở hữu đội ngũ nhân sự hiện trường thường trực 24/7 trực tiếp tại <strong>Cửa khẩu Quốc tế Móng Cái (Bắc Luân 2 & Ka Long - Quảng Ninh), Cửa khẩu Quốc tế Hữu Nghị, Tân Thanh và Chi Ma (Lạng Sơn)</strong>, am hiểu sâu sắc quy định kiểm hóa, chính sách quản lý chuyên ngành và biểu thuế xuất nhập khẩu.</p>
      
      <h4>Năng lực nghiệp vụ cốt lõi:</h4>
      <ul>
        <li><strong>Đại lý hải quan điện tử chính ngạch:</strong> Thực hiện khai báo truyền tờ khai qua hệ thống VNACCS/VCIS nhanh chóng, tiếp nhận luồng tờ khai (Xanh, Vàng, Đỏ) và phối hợp kiểm hóa hiện trường ngay trong ngày.</li>
        <li><strong>Tư vấn chuẩn hóa bộ chứng từ XNK:</strong> Rà soát Hợp đồng thương mại, Commercial Invoice, Packing List, Vận đơn; tra cứu mã HS Code chuẩn xác nhằm tối ưu biểu thuế và phòng ngừa rủi ro tham vấn giá sau thông quan.</li>
        <li><strong>Xin cấp & Kiểm tra tính hợp lệ của C/O Form E (ACFTA):</strong> Trực tiếp xin cấp và kiểm tra tính hợp lệ của chứng nhận xuất xứ Form E để doanh nghiệp hưởng thuế suất nhập khẩu 0% hoặc ưu đãi đặc biệt.</li>
        <li><strong>Thực hiện trọn gói mọi loại hình xuất nhập khẩu:</strong>
          <ul>
            <li>Nhập kinh doanh thương mại (A11)</li>
            <li>Nhập nguyên liệu sản xuất xuất khẩu (E31)</li>
            <li>Gia công may mặc và linh kiện điện tử (E21)</li>
            <li>Tạm nhập tái xuất (G11/G21)</li>
            <li>Hàng tạo tài sản cố định đầu tư miễn thuế</li>
          </ul>
        </li>
        <li><strong>Kiểm tra chuyên ngành:</strong> Đăng ký kiểm dịch thực vật, kiểm dịch động vật, kiểm tra an toàn thực phẩm, công bố hợp quy và kiểm định hàm lượng Formaldehyt cho vải dệt may kịp tiến độ sản xuất.</li>
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
  },
  "van-tai-duong-bo-viet-trung": {
    fullContent: `
      <h3>Năng lực vận tải đường bộ vượt trội với đội xe trực tiếp 50 đầu kéo container</h3>
      <p>Thông qua sự liên kết chặt chẽ với đơn vị thành viên <strong>Việt Phúc Logistics</strong>, Logistics GT tự hào trực tiếp sở hữu và điều hành mạng lưới <strong>50 xe đầu kéo container</strong> hiện đại, chuyên tuyến liên vận hai chiều Việt Nam - Trung Quốc.</p>
      
      <h4>Ưu thế vận tải đường bộ:</h4>
      <ul>
        <li><strong>Sở hữu đội xe 50 đầu kéo container:</strong> 50 đầu kéo chuyên dụng kéo các loại vỏ cont 20ft, 40ft, 45ft, moóc sàn, moóc lùn, moóc rào đáp ứng mọi tải trọng và kích thước hàng hóa trên toàn tuyến biên giới phía Bắc.</li>
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
  },
  "van-chuyen-hang-dac-thu": {
    fullContent: `
      <h3>Thế mạnh cốt lõi: Giải pháp chuyên biệt cho các mặt hàng khó & phức tạp</h3>
      <p>Logistics GT là đơn vị tiếp vận hiếm hoi tại cửa ngõ phía Bắc sở hữu năng lực thực chiến chuyên sâu với các loại hàng hóa đặc thù đòi hỏi tiêu chuẩn kỹ thuật và pháp lý khắt khe nhất.</p>
      
      <h4>4 nhóm hàng hóa thế mạnh cốt lõi:</h4>
      <ul>
        <li><strong>Hàng quá khổ, quá tải (OOG / Project Cargo):</strong> Vận chuyển dây chuyền máy móc nhà máy công nghiệp, thiết bị công trình xây dựng, kết cấu thép siêu trường siêu trọng bằng đội xe Moóc lùn, Moóc rút chuyên dụng; khảo sát tuyến đường và xin giấy phép lưu hành đặc biệt.</li>
        <li><strong>Hàng quá cảnh (Transit Cargo):</strong> Khai báo thủ tục hải quan vận chuyển độc lập, kẹp chì niêm phong điện tử xuyên biên giới (Trung Quốc ⇄ Việt Nam ⇄ Lào / Campuchia / Thái Lan và trung chuyển qua cụm Cảng biển Hải Phòng).</li>
        <li><strong>Hàng hóa chất:</strong> Tư vấn xin giấy phép tiền chất công nghiệp, khai báo hóa chất trực tuyến qua Cổng thông tin một cửa quốc gia, kiểm tra bảng chỉ dẫn an toàn hóa chất MSDS và vận chuyển bằng phương tiện đạt chuẩn an toàn nguy hiểm.</li>
        <li><strong>Hàng vải & nguyên phụ liệu dệt may:</strong> Thông quan nhanh số lượng lớn hàng trăm container vải cuộn mỗi tháng; phối hợp các trung tâm kiểm định xử lý nhanh thủ tục kiểm tra chuyên ngành hàm lượng Formaldehyt và amin thơm, đảm bảo nguyên liệu kịp thời cho dây chuyền xưởng may.</li>
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
  },
  "van-tai-bien-dao-co-to": {
    fullContent: `
      <h3>Chuyên tuyến vận tải biển bằng tàu tải trọng lớn & sà lan đi khắp quần đảo Cô Tô</h3>
      <p>Logistics GT kết hợp cùng đơn vị thành viên <strong>Vận tải Cô Tô</strong> trực tiếp vận hành đội tàu biển và sà lan chuyên dụng, đảm bảo kết nối huyết mạch vận chuyển vật tư và hàng hóa từ đất liền ra toàn bộ các đảo thuộc quần đảo Cô Tô, Quảng Ninh.</p>
      
      <h4>Năng lực vận chuyển biển đảo:</h4>
      <ul>
        <li><strong>Khai thác đội tàu và sà lan chuyên dụng:</strong> Vận chuyển hàng hóa từ đất liền ra tất cả các đảo thuộc quần đảo Cô Tô (Cô Tô lớn, Cô Tô con, đảo Thanh Lân và các đảo phụ cận).</li>
        <li><strong>Năng lực chuyên chở vật tư công trình:</strong> Vận chuyển khối lượng lớn vật liệu xây dựng (cát, đá, xi măng, sắt thép), máy móc công trình cơ giới nặng, xe cơ giới và thiết bị dự án điện nước biển đảo.</li>
        <li><strong>Cung ứng nhu yếu phẩm và hàng dân sinh:</strong> Đảm bảo luồng vận tải hàng tiêu dùng, lương thực, thực phẩm phục vụ dân sinh và du lịch biển đảo an toàn, đều đặn.</li>
        <li><strong>Chủ động lịch trình và phương tiện:</strong> Điều hành phương tiện linh hoạt, bến bãi tập kết rộng rãi, cam kết tiến độ và bảo toàn 100% chất lượng hàng hóa khi cập bến đảo.</li>
      </ul>
    `,
    fullContentEn: `
      <h3>Direct Sea Vessel & Barge Freight to All Co To Archipelago Islands</h3>
      <p>GT Logistics and member unit <strong>Co To Transport</strong> operate high-tonnage cargo vessels and barges connecting mainland ports to all Co To islands.</p>
      <h4>Island Maritime Capabilities:</h4>
      <ul>
        <li>Specialized fleet: Large cargo ships and flat-deck barges operating from Van Don / Cam Pha to Greater Co To, Minor Co To, and Thanh Lan Island.</li>
        <li>Heavy construction logistics: Sand, gravel, cement, steel rebar, excavators, and power/water infrastructure equipment.</li>
        <li>Vital consumer & tourism supplies: Fresh food, groceries, consumer goods ensuring continuous island livelihood.</li>
        <li>Direct operational control ensuring flexible scheduling, safe sea transit, and reliable cargo integrity.</li>
      </ul>
    `,
    fullContentZh: `
      <h3>自营货运轮船与工程驳船直达广宁姑苏群岛全境专线</h3>
      <p>GT 物流与成员企业<strong>姑苏客货运公司</strong>深度联运，自营大吨位货轮与工程驳船，直通姑苏县所有岛屿。</p>
      <h4>海运海岛核心优势：</h4>
      <ul>
        <li>专业船队直达：从云屯、锦普陆地码头直发姑苏大岛、小岛、清麟岛及周边各岛屿。</li>
        <li>重点承揽工程物资：大量承运沙石、水泥、钢筋、大型挖掘机工程车辆及水电重大工程设备。</li>
        <li>民生与旅游物资保供：稳定运输日用消费品、生鲜食品、粮食蔬菜，有力保障海岛民生与文旅产业发展。</li>
        <li>完全自营调度，航次充裕，风浪安全把控严格，确保物资完好上岛。</li>
      </ul>
    `,
  },
};

const getCachedServicesList = unstable_cache(
  async () => {
    const services = await prisma.service.findMany({
      orderBy: { sortOrder: "asc" },
    });

    const validSlugs = new Set(SERVICE_CATEGORIES.map((s) => s.slug));
    const validDbServices = services.filter((s) => validSlugs.has(s.slug));
    if (validDbServices.length === 4) {
      return validDbServices.map((dbS) => {
        const rich = OFFICIAL_SERVICE_DETAILS[dbS.slug];
        if (rich && (!dbS.fullContent || dbS.fullContent.length < 150)) {
          return {
            ...dbS,
            fullContent: rich.fullContent,
            fullContentEn: rich.fullContentEn,
            fullContentZh: rich.fullContentZh,
          };
        }
        return dbS;
      });
    }

    return SERVICE_CATEGORIES.map((s, idx) => {
      const match = services.find((dbS) => dbS.slug === s.slug);
      const rich = OFFICIAL_SERVICE_DETAILS[s.slug];
      return {
        id: match?.id || `svc_${idx}`,
        title: match?.title || s.title,
        titleEn: match?.titleEn || s.titleEn,
        titleZh: match?.titleZh || s.titleZh,
        slug: s.slug,
        shortDesc: match?.shortDesc || s.shortDesc,
        shortDescEn: match?.shortDescEn || s.shortDescEn,
        shortDescZh: match?.shortDescZh || s.shortDescZh,
        fullContent: match?.fullContent && match.fullContent.length >= 150 ? match.fullContent : rich?.fullContent || `<p>${s.shortDesc}</p>`,
        fullContentEn: match?.fullContentEn && match.fullContentEn.length >= 150 ? match.fullContentEn : rich?.fullContentEn || `<p>${s.shortDescEn}</p>`,
        fullContentZh: match?.fullContentZh && match.fullContentZh.length >= 150 ? match.fullContentZh : rich?.fullContentZh || `<p>${s.shortDescZh}</p>`,
        iconName: s.iconName,
        bannerImage: match?.bannerImage || s.bannerImage,
        sortOrder: idx + 1,
        isFeatured: true,
        createdAt: match?.createdAt || new Date(),
        updatedAt: match?.updatedAt || new Date(),
      };
    });
  },
  ["services-list"],
  { revalidate: 300, tags: ["services"] }
);

export async function getServices() {
  try {
    return await getCachedServicesList();
  } catch (error) {
    console.error("Lỗi lấy danh sách dịch vụ:", error);
    return [];
  }
}

const getCachedServiceDetail = unstable_cache(
  async (slug: string) => {
    const rich = OFFICIAL_SERVICE_DETAILS[slug];
    const service = await prisma.service.findUnique({
      where: { slug },
    });
    if (service) {
      if (rich && (!service.fullContent || service.fullContent.length < 150)) {
        return {
          ...service,
          fullContent: rich.fullContent,
          fullContentEn: rich.fullContentEn,
          fullContentZh: rich.fullContentZh,
        };
      }
      return service;
    }

    // Fallback to static with rich content
    const fallback = SERVICE_CATEGORIES.find((s) => s.slug === slug);
    if (fallback) {
      return {
        id: "svc_fallback",
        title: fallback.title,
        titleEn: fallback.titleEn,
        titleZh: fallback.titleZh,
        slug: fallback.slug,
        shortDesc: fallback.shortDesc,
        shortDescEn: fallback.shortDescEn,
        shortDescZh: fallback.shortDescZh,
        fullContent: rich?.fullContent || `<p>${fallback.shortDesc}</p>`,
        fullContentEn: rich?.fullContentEn || `<p>${fallback.shortDescEn}</p>`,
        fullContentZh: rich?.fullContentZh || `<p>${fallback.shortDescZh}</p>`,
        iconName: fallback.iconName,
        bannerImage: fallback.bannerImage,
        sortOrder: 1,
        isFeatured: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }
    return null;
  },
  ["service-detail"],
  { revalidate: 300, tags: ["services"] }
);

export async function getServiceBySlug(slug: string) {
  try {
    return await getCachedServiceDetail(slug);
  } catch (error) {
    console.error("Lỗi lấy chi tiết dịch vụ:", error);
    return null;
  }
}

export async function updateServiceContent(
  slug: string,
  data: {
    title?: string;
    titleEn?: string;
    titleZh?: string;
    shortDesc?: string;
    shortDescEn?: string;
    shortDescZh?: string;
    bannerImage?: string;
    fullContent?: string;
    fullContentEn?: string;
    fullContentZh?: string;
  }
) {
  try {
    const { revalidatePath } = await import("next/cache");
    const updated = await prisma.service.update({
      where: { slug },
      data,
    });
    revalidateTag("services");
    revalidatePath("/", "layout");
    revalidatePath("/services");
    revalidatePath(`/services/${slug}`);
    return { success: true, message: "Đã cập nhật dịch vụ thành công!", service: updated };
  } catch (error) {
    console.error("Lỗi cập nhật dịch vụ:", error);
    return {
      success: false,
      message: "Lỗi khi lưu dịch vụ: " + (error instanceof Error ? error.message : String(error)),
    };
  }
}
