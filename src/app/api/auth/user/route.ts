import { NextRequest } from "next/server";
import { getUserIdFromToken } from "@/lib/auth";
import { ok, error } from "@/lib/api";
import { prisma } from "@/lib/prisma";
import { refreshUser } from "@/services/auth.service";
import { setAuthCookies } from "@/lib/tokens";

export async function GET(req: NextRequest) {
  let accessToken = req.cookies.get("accessToken")?.value;

  let userId = getUserIdFromToken(accessToken);

  let newAccessToken: string | null = null;
  let newRefreshToken: string | null = null;

  if (!userId) {
    const refreshToken = req.cookies.get("refreshToken")?.value;
    console.log("Attempting to refresh with token:", refreshToken);
    if (refreshToken != undefined) {
      try {
        const refreshed = refreshUser(refreshToken);

        newAccessToken = refreshed.accessToken;
        newRefreshToken = refreshed.refreshToken;

        userId = getUserIdFromToken(newAccessToken);
      } catch {
        return error("Unauthorized", 401);
      }
    }
  }

  if (!userId) {
    return ok(null);
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      createdAt: true,
    },
  });

  const response = ok(user);

  if (newAccessToken && newRefreshToken) {
    setAuthCookies(response, newAccessToken, newRefreshToken);
  }

  return response;
}

export const dynamic = "force-dynamic";
