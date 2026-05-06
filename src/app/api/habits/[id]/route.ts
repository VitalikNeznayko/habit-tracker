import { NextRequest } from "next/server";
import { getUserIdFromToken } from "@/lib/auth";
import { ok, error } from "@/lib/api";
import { updateHabit, deleteHabit } from "@/services/habit.service";
import { updateHabitSchema } from "@/lib/validators";
import { getHabitByIdWithStats } from "@/services/habit.service";

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const token = req.cookies.get("accessToken")?.value;
  const userId = getUserIdFromToken(token);

  if (!userId) return error("Unauthorized", 401);

  const params = await context.params;

  const body = await req.json();
  const parsed = updateHabitSchema.safeParse(body);

  if (!parsed.success) {
    return error(parsed.error.issues[0].message, 400);
  }

  try {
    const habit = await updateHabit(
      userId,
      params.id,
      parsed.data.title,
      parsed.data.description,
    );

    return ok(habit);
  } catch (e: unknown) {
    console.error("UPDATE ERROR:", e);

    if (e instanceof Error && e.message === "NOT_FOUND") {
      return error("Not found", 404);
    }

    return error(e instanceof Error ? e.message : "Server error", 500);
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const token = req.cookies.get("accessToken")?.value;
  const userId = getUserIdFromToken(token);

  if (!userId) return error("Unauthorized", 401);

  const params = await context.params;


  try {
    const result = await deleteHabit(userId, params.id);
    return ok(result);
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "NOT_FOUND") {
      return error("Not found", 404);
    }

    return error("Server error", 500);
  }
}

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const token = req.cookies.get("accessToken")?.value;
  const userId = getUserIdFromToken(token);

  if (!userId) return error("Unauthorized", 401);

  const params = await context.params;

  try {
    const habit = await getHabitByIdWithStats(userId, params.id);
    return ok(habit);
  } catch (e: unknown) {
    if (e instanceof Error && e.message === "NOT_FOUND") {
      return error("Not found", 404);
    }

    return error("Server error", 500);
  }
}
