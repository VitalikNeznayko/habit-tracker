import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

function getUserId(req: NextRequest) {
  const token = req.cookies.get("accessToken")?.value;

  if (!token) return null;

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
    };

    return payload.userId;
  } catch {
    return null;
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const userId = getUserId(req);

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const habitId = params.id;

  const habit = await prisma.habit.findFirst({
    where: {
      id: habitId,
      userId,
    },
  });

  if (!habit) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const checkins = await prisma.checkIn.findMany({
    where: { habitId },
    orderBy: { date: "asc" }, 
  });

  if (checkins.length === 0) {
    return NextResponse.json({ longestStreak: 0 });
  }

  let longest = 0;
  let current = 1;

  for (let i = 1; i < checkins.length; i++) {
    const prev = new Date(checkins[i - 1].date);
    const curr = new Date(checkins[i].date);

    prev.setHours(0, 0, 0, 0);
    curr.setHours(0, 0, 0, 0);

    const diff = (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);

    if (diff === 1) {
      current++;
    } else {
      longest = Math.max(longest, current);
      current = 1;
    }
  }

  longest = Math.max(longest, current);

  return NextResponse.json({ longestStreak: longest });
}
