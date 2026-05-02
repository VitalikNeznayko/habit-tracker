import { NextRequest } from "next/server";
import { getUserIdFromToken } from "@/lib/auth";
import { ok, error } from "@/lib/api";
import { updateHabit, deleteHabit } from "@/services/habit.service";
import { updateHabitSchema } from "@/lib/validators";

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const token = req.cookies.get("accessToken")?.value;
  const userId = getUserIdFromToken(token);

  if (!userId) return error("Unauthorized", 401);

  const { id } = await context.params; 

  if (!id) return error("Invalid id", 400);

  const body = await req.json();
  const parsed = updateHabitSchema.safeParse(body);

  if (!parsed.success) {
    return error(parsed.error.issues[0].message, 400);
  }

  try {
    const habit = await updateHabit(
      userId,
      id,
      parsed.data.title,
      parsed.data.description,
    );

    return ok(habit);
  } catch (e: any) {
    console.error("UPDATE ERROR:", e);

    if (e.message === "NOT_FOUND") return error("Not found", 404);

    return error(e.message || "Server error", 500);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const token = req.cookies.get("accessToken")?.value;
  const userId = getUserIdFromToken(token);

  if (!userId) return error("Unauthorized", 401);

  try {
    const result = await deleteHabit(userId, params.id);
    return ok(result);
  } catch (e: any) {
    if (e.message === "NOT_FOUND") return error("Not found", 404);
    return error("Server error", 500);
  }
}
