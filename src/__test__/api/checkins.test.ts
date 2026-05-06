import { describe, expect, it, vi } from "vitest";

import { POST } from "@/app/api/checkins/route";

import { toggleCheckIn } from "@/services/checkin.service";

vi.mock("@/services/checkin.service", () => ({
  toggleCheckIn: vi.fn(),
}));

vi.mock("@/lib/auth", () => ({
  getUserIdFromToken: vi.fn(() => "user-id"),
}));

describe("POST /api/checkins", () => {
  it("toggles checkin", async () => {
    vi.mocked(toggleCheckIn).mockResolvedValue({
      completed: true,
    });

    const request = {
      cookies: {
        get: () => ({
          value: "token",
        }),
      },

      json: async () => ({
        habitId: "habit-id",
      }),
    } as never;

    const response = await POST(request);

    expect(response.status).toBe(200);
  });
});
