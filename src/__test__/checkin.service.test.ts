import { describe, expect, it, vi } from "vitest";

import { toggleCheckIn } from "@/services/checkin.service";

import { prisma } from "@/lib/prisma";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    habit: {
      findFirst: vi.fn(),
    },

    checkIn: {
      findUnique: vi.fn(),
      create: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

describe("toggleCheckIn", () => {
  it("creates check-in", async () => {
    vi.mocked(prisma.habit.findFirst).mockResolvedValue({
      id: "1",
    } as never);

    vi.mocked(prisma.checkIn.findUnique).mockResolvedValue(null as never);

    const result = await toggleCheckIn("user-id", "habit-id");

    expect(result.completed).toBe(true);
  });

  it("removes existing check-in", async () => {
    vi.mocked(prisma.habit.findFirst).mockResolvedValue({
      id: "1",
    } as never);

    vi.mocked(prisma.checkIn.findUnique).mockResolvedValue({
      id: "checkin-id",
    } as never);

    const result = await toggleCheckIn("user-id", "habit-id");

    expect(result.completed).toBe(false);
  });

  it("throws if habit missing", async () => {
    vi.mocked(prisma.habit.findFirst).mockResolvedValue(null as never);

    await expect(toggleCheckIn("user-id", "habit-id")).rejects.toThrow(
      "NOT_FOUND",
    );
  });
});
