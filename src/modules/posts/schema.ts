import { z } from "zod";

export const PostSchema = z.object({
  title: z.string().min(5, "Tiêu đề phải có ít nhất 5 ký tự").max(200, "Tiêu đề quá dài"),
  slug: z.string().optional(),
  excerpt: z.string().min(10, "Đoạn trích tóm tắt phải có ít nhất 10 ký tự").max(500, "Tóm tắt quá dài"),
  content: z.string().min(20, "Nội dung bài viết phải có ít nhất 20 ký tự"),
  coverImage: z.string().url("Đường dẫn ảnh bìa không hợp lệ").or(z.string().min(1, "Vui lòng chọn ảnh bìa")),
  category: z.string().min(2, "Vui lòng chọn chuyên mục"),
  isPublished: z.boolean().default(true),
});

export type PostInput = z.infer<typeof PostSchema>;
