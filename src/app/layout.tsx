import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FloatingContact } from "@/components/layout/FloatingContact";
import { getSiteSettings } from "@/modules/settings/actions";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const companyName = settings.companyName || "CÔNG TY TNHH LOGISTICS GT";
  const tagline = settings.tagline || "Tiếp Vận & Xuất Nhập Khẩu Chuyên Tuyến Cửa Khẩu Việt - Trung";

  return {
    title: {
      default: `${companyName} | ${tagline}`,
      template: `%s | ${companyName}`,
    },
    description:
      "Công ty TNHH Logistics GT chuyên cung cấp dịch vụ vận tải đường bộ liên vận Móng Cái, thủ tục hải quan xuất nhập khẩu chính ngạch, xin C/O Form E và kho bãi biên mậu.",
    keywords: [
      "Logistics GT",
      "GT Logistics",
      "Vận tải Móng Cái",
      "Thủ tục hải quan Móng Cái",
      "Xuất nhập khẩu Việt Trung",
      "C/O Form E",
      "Cửa khẩu Bắc Luân 2",
    ],
    authors: [{ name: companyName }],
    openGraph: {
      title: `${companyName} - Tiếp Vận & Xuất Nhập Khẩu Việt Trung`,
      description:
        "Dịch vụ vận tải đường bộ, thủ tục hải quan Móng Cái, kho bãi và ủy thác xuất nhập khẩu chính ngạch hàng đầu tại Quảng Ninh và Hải Phòng.",
      type: "website",
      locale: "vi_VN",
    },
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSiteSettings();

  return (
    <html lang="vi" className="scroll-smooth">
      <body className="min-h-screen flex flex-col antialiased text-slate-800 bg-white">
        <Header
          companyName={settings.companyName}
          hotline={settings.hotline}
          email={settings.email}
        />
        <main className="flex-1">{children}</main>
        <Footer
          companyName={settings.companyName}
          hotline={settings.hotline}
          zaloPhone={settings.zaloPhone}
          email={settings.email}
          headquarters={settings.headquarters}
          branchHaiPhong={settings.branchHaiPhong}
          taxCode={settings.taxCode}
        />
        <FloatingContact
          hotline={settings.hotline}
          zaloPhone={settings.zaloPhone}
        />
      </body>
    </html>
  );
}
