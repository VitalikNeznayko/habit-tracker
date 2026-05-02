import { NextRequest } from "next/server";
import { getUserIdFromToken } from "@/lib/auth";
import { ok, error } from "@/lib/api";
import { toggleCheckIn } from "@/services/checkin.service";
import { checkInSchema } from "@/lib/validators";

export async function POST(req: NextRequest) {
  const token = req.cookies.get("accessToken")?.value;
  const userId = getUserIdFromToken(token);

  if (!userId) return error("Unauthorized", 401);

  const body = await req.json();
  const parsed = checkInSchema.safeParse(body);

  if (!parsed.success) {
    return error(parsed.error.issues[0].message, 400);
  }

  try {
    const result = await toggleCheckIn(userId, parsed.data.habitId);

    return ok(result);
  } catch (e: any) {
    if (e.message === "NOT_FOUND") return error("Not found", 404);
    return error("Server error", 500);
  }
}
