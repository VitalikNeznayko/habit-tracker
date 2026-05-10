import { NextRequest, NextResponse } from "next/server";
import { requireUserId } from "@/lib/auth";
import { ok, error } from "@/lib/api";
import { createHabit, getUserHabitsWithStats } from "@/services/habit.service";
import { createHabitSchema } from "@/lib/validators";

export async function GET(req: NextRequest) {
  const userId = requireUserId(req);
  if (userId instanceof NextResponse) return userId;

  const habits = await getUserHabitsWithStats(userId);
  return ok(habits);
}

export async function POST(req: NextRequest) {
  const userId = requireUserId(req);
  if (userId instanceof NextResponse) return userId;

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
