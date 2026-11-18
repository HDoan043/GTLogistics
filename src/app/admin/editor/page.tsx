import React from "react";
import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/auth";
import { getAllPageContents } from "@/modules/content/actions";
import { getServices } from "@/modules/services/actions";
import { getSiteSettings } from "@/modules/settings/actions";
import { VisualEditorCanvas } from "@/components/admin/visual-editor/VisualEditorCanvas";

export const metadata = {
  title: "Trình Sửa Trực Quan (On-Page Editor) | GT Logistics",
};

export default async function AdminEditorPage() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    redirect("/admin/login");
  }

  const [contents, services, settings] = await Promise.all([
    getAllPageContents(),
    getServices(),
    getSiteSettings(),
  ]);

  return (
    <VisualEditorCanvas
      initialHero={contents.hero}
      initialWhyUs={contents.whyUs}
      initialStats={contents.stats}
      initialAbout={contents.about}
      initialBanners={contents.banners}
      initialHomeServices={contents.homeServices}
      initialServices={services}
      settings={settings}
    />
  );
}
