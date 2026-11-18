import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isDashboard = pathname.startsWith("/dashboard");
  const isPayment = pathname.startsWith("/payment");
  const isAuth = pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up");

  const sessionCookie = getSessionCookie(request);

  if ((isDashboard || isPayment) && !sessionCookie) {
    const url = new URL("/sign-in", request.url);
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }
  if (isAuth && sessionCookie) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/payment/:path*", "/sign-in", "/sign-up"],
};
