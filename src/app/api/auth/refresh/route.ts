import { NextRequest } from "next/server";
import { error, ok } from "@/lib/api";
import { refreshUser } from "@/services/auth.service";
import { setAuthCookies } from "@/lib/tokens";

export async function POST(req: NextRequest) {
  const refreshToken = req.cookies.get("refreshToken")?.value;

  if (!refreshToken) {
    return error("No refresh token", 401);
  }

  try {
    const { accessToken, refreshToken: newRefreshToken } =
      refreshUser(refreshToken);

    const response = ok({
      message: "Token refreshed",
    });

    setAuthCookies(response, accessToken, newRefreshToken);

    return response;
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "INVALID_TOKEN") {
      return error("Invalid refresh token", 401);
    }

    return error("Server error", 500);
  }
}
export const dynamic = "force-dynamic";
