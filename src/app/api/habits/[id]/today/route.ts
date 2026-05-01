import { NextRequest } from "next/server";
import { getUserIdFromToken } from "@/lib/auth";
import { ok, error } from "@/lib/api";
import { getTodayStatus } from "@/services/checkin.service";

export async function GET(req: NextRequest, { params }: any) {
  const userId = getUserIdFromToken(req.cookies.get("accessToken")?.value);

  if (!userId) return error("Unauthorized", 401);

  try {
    return ok(await getTodayStatus(userId, params.id));
  } catch (e: any) {
    if (e.message === "NOT_FOUND") return error("Not found", 404);
    return error("Server error", 500);
  }
}
