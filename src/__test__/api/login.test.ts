import { describe, expect, it, vi } from "vitest";

import { POST } from "@/app/api/auth/login/route";

import { loginUser } from "@/services/auth.service";

vi.mock("@/services/auth.service", () => ({
  loginUser: vi.fn(),
}));

describe("POST /api/auth/login", () => {
  it("logs in user", async () => {
    vi.mocked(loginUser).mockResolvedValue({
      user: {
        id: "1",
        email: "test@gmail.com",
      },

      accessToken: "access",

      refreshToken: "refresh",
    } as never);

    const request = new Request("http://localhost/api/auth/login", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        email: "test@gmail.com",

        password: "Password123",
      }),
    });

    const response = await POST(request);

    expect(response.status).toBe(200);
  });

  it("returns 401", async () => {
    vi.mocked(loginUser).mockRejectedValue(new Error("INVALID_CREDENTIALS"));

    const request = new Request("http://localhost/api/auth/login", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        email: "wrong@gmail.com",

        password: "wrong",
      }),
    });

    const response = await POST(request);

    expect(response.status).toBe(401);
  });
});
