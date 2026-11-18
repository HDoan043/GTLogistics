import { redirect } from "next/navigation";

export default function TrackingPage() {
  // Chức năng tra cứu vận đơn đã được tinh gọn và chuyển hướng sang trang Dịch vụ
  redirect("/services");
}
