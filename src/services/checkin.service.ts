import { prisma } from "@/lib/prisma";
import { normalizeDay } from "@/lib/date";
import { NotFoundError } from "@/lib/errors";

export async function toggleCheckIn(userId: string, habitId: string) {
  const habit = await prisma.habit.findFirst({
    where: { id: habitId, userId },
  });

  if (!habit) throw new NotFoundError();

  const today = normalizeDay(new Date());

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
