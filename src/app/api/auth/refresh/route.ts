import { NextRequest, NextResponse } from "next/server";
import { refreshUser } from "@/services/auth.service";
import { setAuthCookies } from "@/lib/tokens";

export async function POST(req: NextRequest) {
  const refreshToken = req.cookies.get("refreshToken")?.value;

  if (!refreshToken) {
    return NextResponse.json({ error: "No refresh token" }, { status: 401 });
  }

  try {
    const { accessToken, refreshToken: newRefreshToken } =
      refreshUser(refreshToken);

    const response = NextResponse.json({
      message: "Token refreshed",
    });

    setAuthCookies(response, accessToken, newRefreshToken);

    return response;
  } catch (e: any) {
    if (e.message === "INVALID_TOKEN") {
      return NextResponse.json(
        { error: "Invalid refresh token" },
        { status: 401 },
      );
    }

    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
