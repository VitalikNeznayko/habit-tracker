import { NextRequest } from "next/server";
import { getUserIdFromToken } from "@/lib/auth";
import { ok, error } from "@/lib/api";
import { createHabit, getUserHabits } from "@/services/habit.service";

export async function GET(req: NextRequest) {
  const userId = getUserIdFromToken(req.cookies.get("accessToken")?.value);

  if (!userId) return error("Unauthorized", 401);

  const habits = await getUserHabits(userId);

  return ok(habits);
}

export async function POST(req: NextRequest) {
  const userId = getUserIdFromToken(req.cookies.get("accessToken")?.value);

  if (!userId) return error("Unauthorized", 401);

  const { title } = await req.json();

  if (!title) return error("Title required");

  const habit = await createHabit(userId, title);

  return ok(habit);
}
