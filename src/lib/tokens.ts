import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export function generateTokens(userId: string) {
  const JWT_SECRET = process.env.JWT_SECRET;
  const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

  if (!JWT_SECRET || !JWT_REFRESH_SECRET) {
    throw new Error("JWT secrets are not defined");
  }

  const accessToken = jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: "10m",
  });

  const refreshToken = jwt.sign({ userId }, JWT_REFRESH_SECRET, {
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
