import { toggleCheckIn } from "@/services/checkin.service";

import { prisma } from "@/lib/prisma";

jest.mock("@/lib/prisma", () => ({
  prisma: {
    habit: {
      findFirst: jest.fn(),
    },

    checkIn: {
      findUnique: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

describe("toggleCheckIn", () => {
  it("creates check-in", async () => {
    (prisma.habit.findFirst as jest.Mock).mockResolvedValue({
      id: "1",
    });

    (prisma.checkIn.findUnique as jest.Mock).mockResolvedValue(null);

    const result = await toggleCheckIn("user-id", "habit-id");

    expect(result.completed).toBe(true);
  });

  it("removes existing check-in", async () => {
    (prisma.habit.findFirst as jest.Mock).mockResolvedValue({
      id: "1",
    });

    (prisma.checkIn.findUnique as jest.Mock).mockResolvedValue({
      id: "checkin-id",
    });

    const result = await toggleCheckIn("user-id", "habit-id");

    expect(result.completed).toBe(false);
  });

  it("throws if habit missing", async () => {
    (prisma.habit.findFirst as jest.Mock).mockResolvedValue(null);

    await expect(toggleCheckIn("user-id", "habit-id")).rejects.toThrow(
      "NOT_FOUND",
    );
  });
});
