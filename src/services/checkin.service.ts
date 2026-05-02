import { prisma } from "@/lib/prisma";

function normalize(date: Date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

export async function toggleCheckIn(userId: string, habitId: string) {
  const habit = await prisma.habit.findFirst({
    where: { id: habitId, userId },
  });

  if (!habit) throw new Error("NOT_FOUND");

  const today = normalize(new Date());

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
      where: { id: existing.id },
    });

    return { completed: false };
  }

  await prisma.checkIn.create({
    data: {
      habitId,
      date: today,
      completed: true,
    },
  });

  return { completed: true };
}

export async function getTodayStatus(userId: string, habitId: string) {
  const habit = await prisma.habit.findFirst({
    where: { id: habitId, userId },
  });

  if (!habit) throw new Error("NOT_FOUND");

  const today = normalize(new Date());

  const check = await prisma.checkIn.findUnique({
    where: {
      habitId_date: {
        habitId,
        date: today,
      },
    },
  });

  return { completed: !!check };
}

export async function getProgress(userId: string, habitId: string) {
  const habit = await prisma.habit.findFirst({
    where: { id: habitId, userId },
  });

  if (!habit) throw new Error("NOT_FOUND");

  const days = 30;

  const fromDate = new Date();
  fromDate.setHours(0, 0, 0, 0);
  fromDate.setDate(fromDate.getDate() - days);

  const checkins = await prisma.checkIn.findMany({
    where: {
      habitId,
      date: { gte: fromDate },
    },
  });

  const completedDays = checkins.length;

  return {
    percent: Math.round((completedDays / days) * 100),
    completedDays,
    totalDays: days,
  };
}

export async function getLongestStreak(userId: string, habitId: string) {
  const habit = await prisma.habit.findFirst({
    where: { id: habitId, userId },
  });

  if (!habit) throw new Error("NOT_FOUND");

  const checkins = await prisma.checkIn.findMany({
    where: { habitId },
    orderBy: { date: "asc" },
  });

  if (!checkins.length) return { longestStreak: 0 };

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

  return { longestStreak: longest };
}

export async function getCurrentStreak(userId: string, habitId: string) {
  const habit = await prisma.habit.findFirst({
    where: { id: habitId, userId },
  });

  if (!habit) throw new Error("NOT_FOUND");

  const checkins = await prisma.checkIn.findMany({
    where: { habitId },
    orderBy: { date: "desc" },
  });

  let streak = 0;
  let currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  for (const check of checkins) {
    const d = new Date(check.date);
    d.setHours(0, 0, 0, 0);

    if (d.getTime() === currentDate.getTime()) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }
  }

  return { streak };
}

