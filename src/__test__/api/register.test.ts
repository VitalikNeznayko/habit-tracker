import { describe, expect, it, vi } from "vitest";

import { POST } from "@/app/api/auth/register/route";

import { registerUser } from "@/services/auth.service";

vi.mock("@/services/auth.service", () => ({
  registerUser: vi.fn(),
}));

describe("POST /api/auth/register", () => {
  it("registers user", async () => {
    vi.mocked(registerUser).mockResolvedValue({
      user: {
        id: "1",
        email: "test@gmail.com",
      },

      accessToken: "access",

      refreshToken: "refresh",
    } as never);

    const request = new Request("http://localhost/api/auth/register", {
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

  it("returns 400", async () => {
    const request = new Request("http://localhost/api/auth/register", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        email: "bad",

        password: "123",
      }),
    });

    const response = await POST(request);

    expect(response.status).toBe(400);
  });
});
