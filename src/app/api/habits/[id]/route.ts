import { NextRequest } from "next/server";
import { getUserIdFromToken } from "@/lib/auth";
import { ok, error } from "@/lib/api";
import { updateHabit, deleteHabit } from "@/services/habit.service";

export async function PUT(req: NextRequest, { params }: any) {
  const userId = getUserIdFromToken(req.cookies.get("accessToken")?.value);

  if (!userId) return error("Unauthorized", 401);

  const { title, description } = await req.json();

  try {
    const habit = await updateHabit(userId, params.id, title, description);

    return ok(habit);
  } catch (e: any) {
    if (e.message === "NOT_FOUND") return error("Not found", 404);
    return error("Server error", 500);
  }
}

export async function DELETE(req: NextRequest, { params }: any) {
  const userId = getUserIdFromToken(req.cookies.get("accessToken")?.value);

  if (!userId) return error("Unauthorized", 401);

  try {
    const result = await deleteHabit(userId, params.id);
    return ok(result);
  } catch (e: any) {
    if (e.message === "NOT_FOUND") return error("Not found", 404);
    return error("Server error", 500);
  }
}
