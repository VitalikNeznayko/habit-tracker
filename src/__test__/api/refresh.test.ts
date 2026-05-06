import { describe, expect, it, vi } from "vitest";

import { POST } from "@/app/api/auth/refresh/route";

import { refreshUser } from "@/services/auth.service";

vi.mock("@/services/auth.service", () => ({
  refreshUser: vi.fn(),
}));

describe("POST /api/auth/refresh", () => {
  it("refreshes tokens", async () => {
    vi.mocked(refreshUser).mockReturnValue({
      accessToken: "access",

      refreshToken: "refresh",
    });

    const request = {
      cookies: {
        get: () => ({
          value: "refresh-token",
        }),
      },
    } as never;

    const response = await POST(request);

    expect(response.status).toBe(200);
  });

  it("returns 401", async () => {
    vi.mocked(refreshUser).mockImplementation(() => {
      throw new Error("INVALID_TOKEN");
    });

    const request = {
      cookies: {
        get: () => ({
          value: "invalid",
        }),
      },
    } as never;

    const response = await POST(request);

    expect(response.status).toBe(401);
  });
});
