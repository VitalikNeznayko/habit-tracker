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
