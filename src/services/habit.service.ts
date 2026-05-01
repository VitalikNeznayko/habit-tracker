import { prisma } from "@/lib/prisma";

export async function createHabit(userId: string, title: string) {
  return prisma.habit.create({
    data: {
      title,
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