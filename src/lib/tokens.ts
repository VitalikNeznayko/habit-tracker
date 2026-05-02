import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export function generateTokens(userId: string) {
  const accessToken = jwt.sign({ userId }, process.env.JWT_SECRET!, {
    expiresIn: "10m",
  });

  const refreshToken = jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET!, {
    expiresIn: "7d",
  });

  return { accessToken, refreshToken };
}

export function setAuthCookies(
  response: NextResponse,
  accessToken: string,
  refreshToken: string,
) {
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
  };

  response.cookies.set("accessToken", accessToken, {
    ...cookieOptions,
    maxAge: 60 * 10,
  });

  response.cookies.set("refreshToken", refreshToken, {
    ...cookieOptions,
    maxAge: 60 * 60 * 24 * 7,
  });
}
