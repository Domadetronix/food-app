import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySession } from "@/shared/lib/auth/jwt";

export async function proxy(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const session = token ? await verifySession(token) : null;
  const isLoginPage = request.nextUrl.pathname === "/login";

  if (!session && !isLoginPage) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  if (session && isLoginPage) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  return NextResponse.next();
}

export const config = {
  // Пропускаем API (в т.ч. /api/health), статику Next и фавикон.
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
