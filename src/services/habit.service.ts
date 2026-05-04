import { prisma } from "@/lib/prisma";
import { getToday } from "@/lib/date";

type CheckInDate = {
  date: Date;
};

function normalize(date: Date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function getCurrentStreakFromCheckIns(checkins: CheckInDate[]) {
  let streak = 0;
  const currentDate = getToday();

  for (const check of checkins) {
    const d = normalize(check.date);

    if (d.getTime() === currentDate.getTime()) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      break;
    }
  }

  return streak;
}

function getLongestStreakFromCheckIns(checkins: CheckInDate[]) {
  if (!checkins.length) return 0;

  let longest = 0;
  let current = 1;

  for (let i = 1; i < checkins.length; i++) {
    const prev = normalize(checkins[i - 1].date);
    const curr = normalize(checkins[i].date);
    const diff = (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);

    if (diff === 1) {
      current++;
    } else {
      longest = Math.max(longest, current);
      current = 1;
    }
  }

  return Math.max(longest, current);
}

function getProgressPercentFromCheckIns(checkins: CheckInDate[]) {
  const days = 30;
  const fromDate = getToday();
  fromDate.setDate(fromDate.getDate() - days);

  const completedDays = checkins.filter((check) => check.date >= fromDate).length;

  return Math.round((completedDays / days) * 100);
}

export async function createHabit(
  userId: string,
  title: string,
  description?: string,
) {
  return prisma.habit.create({
    data: {
      title,
      description,
      userId,
    },
  });
}

export async function getUserHabits(userId: string) {
  return prisma.habit.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

export async function getUserHabitsWithStats(userId: string) {
  const today = getToday();
  const habits = await prisma.habit.findMany({
    where: { userId },
    include: {
      checkins: {
        select: { date: true },
        orderBy: { date: "desc" },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return habits.map(({ checkins, ...habit }) => ({
    ...habit,
    todayCompleted: checkins.some(
      (check) => normalize(check.date).getTime() === today.getTime(),
    ),
    currentStreak: getCurrentStreakFromCheckIns(checkins),
  }));
}

export async function updateHabit(
  userId: string,
  habitId: string,
  title: string,
  description?: string,
) {
  const habit = await prisma.habit.findFirst({
    where: { id: habitId, userId },
  });

  if (!habit) {
    throw new Error("NOT_FOUND");
  }

  return prisma.habit.update({
    where: { id: habitId },
    data: { title, description },
  });
}

export async function deleteHabit(userId: string, habitId: string) {
  const habit = await prisma.habit.findFirst({
    where: { id: habitId, userId },
  });

  if (!habit) {
    throw new Error("NOT_FOUND");
  }

  await prisma.habit.delete({
    where: { id: habitId },
  });

  return { success: true };
}

export async function getHabitById(userId: string, habitId: string) {
  const habit = await prisma.habit.findFirst({
    where: {
      id: habitId,
      userId,
    },
  });

  if (!habit) {
    throw new Error("NOT_FOUND");
  }

  return habit;
}

export async function getHabitByIdWithStats(userId: string, habitId: string) {
  const today = getToday();
  const habit = await prisma.habit.findFirst({
    where: {
      id: habitId,
      userId,
    },
    include: {
      checkins: {
        select: { date: true },
        orderBy: { date: "asc" },
      },
    },
  });

  if (!habit) {
    throw new Error("NOT_FOUND");
  }

  const checkinsDesc = [...habit.checkins].reverse();
  const { checkins, ...habitData } = habit;

  return {
    ...habitData,
    todayCompleted: checkins.some(
      (check) => normalize(check.date).getTime() === today.getTime(),
    ),
    currentStreak: getCurrentStreakFromCheckIns(checkinsDesc),
    longestStreak: getLongestStreakFromCheckIns(checkins),
    progressPercent: getProgressPercentFromCheckIns(checkins),
  };
}
