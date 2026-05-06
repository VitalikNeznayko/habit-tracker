import { NextRequest } from "next/server";
import { getUserIdFromToken } from "@/lib/auth";
import { ok, error } from "@/lib/api";
import { toggleCheckIn } from "@/services/checkin.service";

export async function POST(req: NextRequest) {
  const token = req.cookies.get("accessToken")?.value;
  const userId = getUserIdFromToken(token);

  if (!userId) return error("Unauthorized", 401);

  const body = await req.json();

  if (!body.habitId) {
    return error("habitId is required", 400);
  }

  try {
    const result = await toggleCheckIn(userId, body.habitId);

    return ok(result);
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "NOT_FOUND") {
      return error("Not found", 404);
    }

    return error("Server error", 500);
  }
}