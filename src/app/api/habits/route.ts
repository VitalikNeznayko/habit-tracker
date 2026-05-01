import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { getUserIdFromToken } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("accessToken")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = getUserIdFromToken(token);

  if (!userId) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  const habits = await prisma.habit.findMany({
    where: {
      userId: userId,
    },
  });

  return NextResponse.json(habits);
}

export async function POST(req: NextRequest) {
  const token = req.cookies.get("accessToken")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = getUserIdFromToken(token);

  if (!userId) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  const { title } = await req.json();

  if (!title) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  const habit = await prisma.habit.create({
    data: {
      title,
      userId,
    },
  });

  return NextResponse.json(habit);
}