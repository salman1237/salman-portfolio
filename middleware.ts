import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const COOKIE_NAME = "admin_session";

async function hasValidSession(token: string | undefined) {
  if (!token) return false;
  const secret = process.env.SESSION_SECRET;
  if (!secret) return false;
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));
    return payload.admin === true;
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/admin/login" || pathname.startsWith("/api/admin/login")) {
    return NextResponse.next();
  }

  const token = request.cookies.get(COOKIE_NAME)?.value;
  const authed = await hasValidSession(token);

  if (!authed) {
    const loginUrl = new URL("/admin/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  // /api/admin/upload is excluded: it checks auth itself (see its route
  // handler), and routing large multipart bodies through Node-runtime
  // middleware first corrupts the request stream before the route handler
  // can read it (Next.js throws "Response body object should not be
  // disturbed or locked").
  matcher: ["/admin/:path*", "/api/admin/((?!upload).*)"],
  runtime: "nodejs",
};
