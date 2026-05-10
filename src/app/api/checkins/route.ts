import { NextRequest, NextResponse } from "next/server";
import { requireUserId } from "@/lib/auth";
import { ok, error } from "@/lib/api";
import { toggleCheckIn } from "@/services/checkin.service";
import { toggleCheckInSchema } from "@/lib/validators";
import { NotFoundError } from "@/lib/errors";

export async function POST(req: NextRequest) {
  const userId = requireUserId(req);
  if (userId instanceof NextResponse) return userId;

  const body = await req.json();
  const parsed = toggleCheckInSchema.safeParse(body);

  if (!parsed.success) {
    return error(parsed.error.issues[0].message, 400);
  }

  try {
    const result = await toggleCheckIn(userId, parsed.data.habitId);
    return ok(result);
  } catch (e: unknown) {
    if (e instanceof NotFoundError) {
      return error("Not found", 404);
    }

    return error("Server error", 500);
  }
}
