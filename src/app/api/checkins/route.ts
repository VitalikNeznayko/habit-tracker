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

export async function POST(req: NextRequest) {
  const userId = getUserId(req);

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { habitId } = await req.json();

  if (!habitId) {
    return NextResponse.json({ error: "habitId required" }, { status: 400 });
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  try {
    const existing = await prisma.checkIn.findUnique({
      where: {
        habitId_date: {
          habitId,
          date: today,
        },
      },
    });

    if (existing) {
      await prisma.checkIn.delete({
        where: {
          id: existing.id,
        },
      });

      return NextResponse.json({ completed: false });
    }

    await prisma.checkIn.create({
      data: {
        habitId,
        date: today,
        completed: true,
      },
    });

    return NextResponse.json({ completed: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Check-in failed" }, { status: 500 });
  }
}
