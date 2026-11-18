import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { cookies, headers } from "next/headers";

export const FALLBACK_JWT_SECRET = "gt-logistics-enterprise-secure-jwt-token-key-2026";

const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET || FALLBACK_JWT_SECRET
);

export const COOKIE_NAME = "gt_admin_session";
export const LEGACY_COOKIE_NAME = "htc_admin_session";

export interface AdminSession {
  userId: string;
  email: string;
  fullName: string;
  role: string;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function createSession(session: AdminSession): Promise<string> {
  const token = await new SignJWT({ ...session })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(SECRET_KEY);

  let isSecure = false;
  try {
    const headerList = await headers();
    const proto = headerList.get("x-forwarded-proto");
    // Chỉ bật secure flag khi kết nối thực tế là HTTPS.
    // Nếu truy cập qua HTTP (ví dụ http://160.191.46.105), cờ secure phải là false để trình duyệt không loại bỏ cookie.
    isSecure = proto === "https";
  } catch {
    isSecure = false;
  }

  const cookieStore = await cookies();
  const cookieOptions = {
    httpOnly: true,
    secure: isSecure,
    sameSite: "lax" as const,
    path: "/",
    maxAge: 7 * 24 * 60 * 60, // 7 ngày
  };

  cookieStore.set(COOKIE_NAME, token, cookieOptions);
  cookieStore.set(LEGACY_COOKIE_NAME, token, cookieOptions);

  return token;
}

export async function verifySession(token: string): Promise<AdminSession | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET_KEY);
    return payload as unknown as AdminSession;
  } catch (err) {
    console.error("Lỗi xác thực JWT Session:", err);
    return null;
  }
}

export async function getCurrentAdmin(): Promise<AdminSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value || cookieStore.get(LEGACY_COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySession(token);
}

export async function deleteSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
  cookieStore.delete(LEGACY_COOKIE_NAME);
}
