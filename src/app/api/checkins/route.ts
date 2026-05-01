import { NextRequest } from "next/server";
import { getUserIdFromToken } from "@/lib/auth";
import { ok, error } from "@/lib/api";
import { toggleCheckIn } from "@/services/checkin.service";

export async function POST(req: NextRequest) {
  const userId = getUserIdFromToken(req.cookies.get("accessToken")?.value);

  if (!userId) return error("Unauthorized", 401);

  const { habitId } = await req.json();

  if (!habitId) return error("habitId required");

  try {
    const result = await toggleCheckIn(userId, habitId);
    return ok(result);
  } catch (e: any) {
    if (e.message === "NOT_FOUND") return error("Not found", 404);
    return error("Server error", 500);
  }
}
