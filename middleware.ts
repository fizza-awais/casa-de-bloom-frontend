import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken, refreshToken } from "./lib/services/auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Define paths that require authentication
  const isDashboardRoute = pathname.startsWith("/dashboard");
  const isAuthRoute = pathname === "/login";

  // Get cookies
  const cookieHeader = request.headers.get("Cookie") || "";
  const accessToken = request.cookies.get("access_token")?.value;
  const refreshTokenVal = request.cookies.get("refresh_token")?.value;

  if (isDashboardRoute) {
    if (!accessToken) {
      // Access token is missing, check if we have a refresh token
      if (refreshTokenVal) {
        const refreshResult = await refreshToken(cookieHeader);
        if (refreshResult.success) {
          const response = NextResponse.next();
          // Forward the Set-Cookie headers from refresh response to browser
          if (refreshResult.headers && refreshResult.headers["Set-Cookie"]) {
            response.headers.set("Set-Cookie", refreshResult.headers["Set-Cookie"]);
          }
          return response;
        }
      }
      // Redirect to login if no valid session
      const loginUrl = new URL("/login", request.url);
      return NextResponse.redirect(loginUrl);
    }

    // Verify token
    const verifyResult = await verifyToken(cookieHeader);
    if (!verifyResult.valid) {
      // Try refresh
      if (refreshTokenVal) {
        const refreshResult = await refreshToken(cookieHeader);
        if (refreshResult.success) {
          const response = NextResponse.next();
          if (refreshResult.headers && refreshResult.headers["Set-Cookie"]) {
            response.headers.set("Set-Cookie", refreshResult.headers["Set-Cookie"]);
          }
          return response;
        }
      }
      const loginUrl = new URL("/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  if (isAuthRoute) {
    // If user is already logged in, redirect them to dashboard
    if (accessToken) {
      const verifyResult = await verifyToken(cookieHeader);
      if (verifyResult.valid) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register/confirmation"],
};
