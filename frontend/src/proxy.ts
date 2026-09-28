import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function decodeJwtRole(token: string): string | null {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );
    const payload = JSON.parse(jsonPayload);
    return payload.role || null;
  } catch (e) {
    return null;
  }
}

export function proxy(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value;
  const { pathname } = request.nextUrl;

  const role = token ? decodeJwtRole(token) : null;

  if (token) {
    if (
      role === "admin" &&
      (pathname === "/login" ||
        pathname === "/register" ||
        pathname === "/" ||
        pathname === "dashboard")
    ) {
      return NextResponse.redirect(new URL("/admin-dashboard", request.url));
    }
    if (pathname === "/login" || pathname === "/register" || pathname === "/") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  } else {
    if (
      pathname === "/dashboard" ||
      pathname === "/" ||
      pathname.startsWith("/admin-dashboard")
    ) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard",
    "/login",
    "/register",
    "/",
    "/admin-dashboard/:path*",
  ],
};
