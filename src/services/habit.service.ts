import { prisma } from "@/lib/prisma";
import { getToday, normalizeDay } from "@/lib/date";
import { NotFoundError } from "@/lib/errors";

type CheckInDate = {
  date: Date;
};

function getCurrentStreakFromCheckIns(checkins: CheckInDate[]) {
  if (!checkins.length) return 0;

  const datesSet = new Set(
    checkins.map((c) => normalizeDay(c.date).getTime()),
  );

  const today = getToday();
  const todayTime = today.getTime();

  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const yesterdayTime = yesterday.getTime();

  let currentDate: Date;

  if (datesSet.has(todayTime)) {
    currentDate = new Date(today);
  } else if (datesSet.has(yesterdayTime)) {
    currentDate = new Date(yesterday);
  } else {
    return 0;
  }

  let streak = 0;

  while (true) {
    const time = normalizeDay(currentDate).getTime();

    if (datesSet.has(time)) {
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
    const prev = normalizeDay(checkins[i - 1].date);
    const curr = normalizeDay(checkins[i].date);
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

const PROGRESS_WINDOW_DAYS = 30;

function getProgressPercentFromCheckIns(checkins: CheckInDate[]) {
  const fromDate = getToday();
  fromDate.setDate(fromDate.getDate() - PROGRESS_WINDOW_DAYS);

  const completedDays = checkins.filter((check) => check.date >= fromDate).length;

  return Math.round((completedDays / PROGRESS_WINDOW_DAYS) * 100);
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
      (check) => normalizeDay(check.date).getTime() === today.getTime(),
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
    throw new NotFoundError();
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
    throw new NotFoundError();
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
    throw new NotFoundError();
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
    throw new NotFoundError();
  }

  const checkinsDesc = [...habit.checkins].reverse();
  const { checkins, ...habitData } = habit;

  return {
    ...habitData,
    todayCompleted: checkins.some(
      (check) => normalizeDay(check.date).getTime() === today.getTime(),
    ),
    currentStreak: getCurrentStreakFromCheckIns(checkinsDesc),
    longestStreak: getLongestStreakFromCheckIns(checkins),
    progressPercent: getProgressPercentFromCheckIns(checkins),
  };
}
