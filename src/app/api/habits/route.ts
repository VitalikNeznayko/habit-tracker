import { NextRequest } from "next/server";
import { getUserIdFromToken } from "@/lib/auth";
import { ok, error } from "@/lib/api";
import { createHabit, getUserHabitsWithStats } from "@/services/habit.service";
import { createHabitSchema } from "@/lib/validators";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("accessToken")?.value;
  const userId = getUserIdFromToken(token);

  if (!userId) return error("Unauthorized", 401);

  const habits = await getUserHabitsWithStats(userId);
  return ok(habits);
}

export async function POST(req: NextRequest) {
  const token = req.cookies.get("accessToken")?.value;
  const userId = getUserIdFromToken(token);

  if (!userId) return error("Unauthorized", 401);

  const body = await req.json();
  const parsed = createHabitSchema.safeParse(body);

  if (!parsed.success) {
    return error(parsed.error.issues[0].message, 400);
  }

  const habit = await createHabit(
    userId,
    parsed.data.title,
    parsed.data.description,
  );

  return ok(habit);
}
