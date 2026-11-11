import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

const FALLBACK_JWT_SECRET = "htc-logistics-enterprise-secure-jwt-token-key-2026";

const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET || FALLBACK_JWT_SECRET
);

const COOKIE_NAME = "htc_admin_session";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(COOKIE_NAME)?.value;

  // Xác thực token JWT
  let isAuthenticated = false;
  if (token) {
    try {
      await jwtVerify(token, SECRET_KEY);
      isAuthenticated = true;
    } catch {
      isAuthenticated = false;
    }
  }

  // 1. Nếu cố truy cập các trang quản trị `/admin/*` (ngoại trừ `/admin/login`) mà chưa đăng nhập
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    if (!isAuthenticated) {
      const loginUrl = new URL("/admin/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 2. Nếu đã đăng nhập mà vẫn vào `/admin/login` thì chuyển hướng thẳng về dashboard
  if (pathname === "/admin/login" && isAuthenticated) {
    const dashboardUrl = new URL("/admin/dashboard", request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  // 3. Đính kèm Security Headers cho toàn bộ phản hồi HTTP
  const response = NextResponse.next();
  response.headers.set("X-Frame-Options", "SAMEORIGIN");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()"
  );

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|images|uploads).*)",
  ],
};
