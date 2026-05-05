import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export async function proxy(req: NextRequest) {
  const accessToken = req.cookies.get("accessToken")?.value;
  const refreshToken = req.cookies.get("refreshToken")?.value;
  const pathname = req.nextUrl.pathname;
  const isAuthPage = pathname === "/login" || pathname === "/register";

  if (accessToken) {
    try {
      jwt.verify(accessToken, process.env.JWT_SECRET!);
      if (isAuthPage) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
      return NextResponse.next();
    } catch {}
  }

  if (refreshToken) {
    try {
      const payload = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET!,
      ) as { userId: string };

      const newAccessToken = jwt.sign(
        { userId: payload.userId },
        process.env.JWT_SECRET!,
        { expiresIn: "10m" },
      );

      const response = NextResponse.next();

      response.cookies.set("accessToken", newAccessToken, {
        httpOnly: true,
        maxAge: 60 * 10,
        path: "/",
      });

      if (isAuthPage) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }

      return response;
    } catch {}
  }

  if (isAuthPage) {
    return NextResponse.next();
  }

  return NextResponse.redirect(new URL("/login", req.url));
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/habit/:path*",
    "/profile/:path*",
    "/login",
    "/register",
  ],
};
