import { describe, expect, it, vi, beforeEach } from "vitest";

import { GET, POST } from "@/app/api/habits/route";

import { createHabit, getUserHabitsWithStats } from "@/services/habit.service";

vi.mock("@/services/habit.service", () => ({
  createHabit: vi.fn(),
  getUserHabitsWithStats: vi.fn(),
}));

vi.mock("@/lib/auth", () => ({
  getUserIdFromToken: vi.fn(() => "user-id"),
}));

describe("GET /api/habits", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns habits", async () => {
    vi.mocked(getUserHabitsWithStats).mockResolvedValue([
      {
        id: "1",
        title: "Workout",
      },
    ] as never);

    const request = {
      cookies: {
        get: () => ({
          value: "token",
        }),
      },
    } as never;

    const response = await GET(request);

    expect(response.status).toBe(200);

    const data = await response.json();

    expect(data).toHaveLength(1);
  });
});

describe("POST /api/habits", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates habit", async () => {
    vi.mocked(createHabit).mockResolvedValue({
      id: "1",
      title: "Workout",
    } as never);

    const request = {
      cookies: {
        get: () => ({
          value: "token",
        }),
      },

      json: async () => ({
        title: "Workout",

        description: "Push ups",
      }),
    } as never;

    const response = await POST(request);

    expect(response.status).toBe(200);

    const data = await response.json();

    expect(data.title).toBe("Workout");
  });

  it("returns 400 for invalid body", async () => {
    const request = {
      cookies: {
        get: () => ({
          value: "token",
        }),
      },

      json: async () => ({
        title: "",
      }),
    } as never;

    const response = await POST(request);

    expect(response.status).toBe(400);
  });
});
