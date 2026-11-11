import { z } from "zod";

export const LeadSchema = z.object({
  fullName: z.string().min(2, "Vui lòng nhập họ và tên (tối thiểu 2 ký tự)").max(100),
  phone: z
    .string()
    .min(9, "Số điện thoại không hợp lệ")
    .max(15, "Số điện thoại không hợp lệ")
    .regex(/^[0-9+.\s()-]+$/, "Số điện thoại chỉ được chứa chữ số và dấu hợp lệ"),
  email: z.string().email("Địa chỉ email không hợp lệ").optional().or(z.literal("")),
  company: z.string().max(150).optional().or(z.literal("")),
  serviceType: z.string().min(2, "Vui lòng chọn loại dịch vụ cần tư vấn"),
  routeOrigin: z.string().max(200).optional().or(z.literal("")),
  routeDestination: z.string().max(200).optional().or(z.literal("")),
  cargoDetails: z.string().max(500).optional().or(z.literal("")),
  message: z.string().max(1000).optional().or(z.literal("")),
});

export type LeadInput = z.infer<typeof LeadSchema>;
