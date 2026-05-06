import {
  createHabit,
  deleteHabit,
  getHabitById,
  updateHabit,
} from "@/services/habit.service";

import { prisma } from "@/lib/prisma";

jest.mock("@/lib/prisma", () => ({
  prisma: {
    habit: {
      create: jest.fn(),
      findFirst: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

describe("createHabit", () => {
  it("creates habit", async () => {
    (prisma.habit.create as jest.Mock).mockResolvedValue({
      id: "1",
      title: "Workout",
    });

    const result = await createHabit("user-id", "Workout", "Push ups");

    expect(result.title).toBe("Workout");
  });
});

describe("updateHabit", () => {
  it("updates habit", async () => {
    (prisma.habit.findFirst as jest.Mock).mockResolvedValue({
      id: "1",
    });

    (prisma.habit.update as jest.Mock).mockResolvedValue({
      id: "1",
      title: "Updated",
    });

    const result = await updateHabit("user-id", "1", "Updated", "Desc");

    expect(result.title).toBe("Updated");
  });

  it("throws when habit missing", async () => {
    (prisma.habit.findFirst as jest.Mock).mockResolvedValue(null);

    await expect(updateHabit("user-id", "1", "Updated")).rejects.toThrow(
      "NOT_FOUND",
    );
  });
});

describe("deleteHabit", () => {
  it("deletes habit", async () => {
    (prisma.habit.findFirst as jest.Mock).mockResolvedValue({
      id: "1",
    });

    (prisma.habit.delete as jest.Mock).mockResolvedValue({
      id: "1",
    });

    const result = await deleteHabit("user-id", "1");

    expect(result.success).toBe(true);
  });
});

describe("getHabitById", () => {
  it("returns habit", async () => {
    (prisma.habit.findFirst as jest.Mock).mockResolvedValue({
      id: "1",
      title: "Workout",
    });

    const result = await getHabitById("user-id", "1");

    expect(result.title).toBe("Workout");
  });

  it("throws if habit missing", async () => {
    (prisma.habit.findFirst as jest.Mock).mockResolvedValue(null);

    await expect(getHabitById("user-id", "1")).rejects.toThrow("NOT_FOUND");
  });
});
