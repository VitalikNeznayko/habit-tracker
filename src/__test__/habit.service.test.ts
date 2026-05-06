import { describe, expect, it, vi } from "vitest";

import {
  createHabit,
  deleteHabit,
  getHabitById,
  updateHabit,
} from "@/services/habit.service";

import { prisma } from "@/lib/prisma";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    habit: {
      create: vi.fn(),
      findFirst: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

describe("createHabit", () => {
  it("creates habit", async () => {
    vi.mocked(prisma.habit.create).mockResolvedValue({
      id: "1",
      title: "Workout",
    } as never);

    const result = await createHabit("user-id", "Workout", "Push ups");

    expect(result.title).toBe("Workout");
  });
});

describe("updateHabit", () => {
  it("updates habit", async () => {
    vi.mocked(prisma.habit.findFirst).mockResolvedValue({
      id: "1",
    } as never);

    vi.mocked(prisma.habit.update).mockResolvedValue({
      id: "1",
      title: "Updated",
    } as never);

    const result = await updateHabit("user-id", "1", "Updated", "Desc");

    expect(result.title).toBe("Updated");
  });

  it("throws when habit missing", async () => {
    vi.mocked(prisma.habit.findFirst).mockResolvedValue(null as never);

    await expect(updateHabit("user-id", "1", "Updated")).rejects.toThrow(
      "NOT_FOUND",
    );
  });
});

describe("deleteHabit", () => {
  it("deletes habit", async () => {
    vi.mocked(prisma.habit.findFirst).mockResolvedValue({
      id: "1",
    } as never);

    vi.mocked(prisma.habit.delete).mockResolvedValue({
      id: "1",
    } as never);

    const result = await deleteHabit("user-id", "1");

    expect(result.success).toBe(true);
  });
});

describe("getHabitById", () => {
  it("returns habit", async () => {
    vi.mocked(prisma.habit.findFirst).mockResolvedValue({
      id: "1",
      title: "Workout",
    } as never);

    const result = await getHabitById("user-id", "1");

    expect(result.title).toBe("Workout");
  });

  it("throws if habit missing", async () => {
    vi.mocked(prisma.habit.findFirst).mockResolvedValue(null as never);

    await expect(getHabitById("user-id", "1")).rejects.toThrow("NOT_FOUND");
  });
});
