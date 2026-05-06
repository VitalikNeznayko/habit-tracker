import { describe, expect, it, vi } from "vitest";

import bcrypt from "bcrypt";

import { loginUser } from "@/services/auth.service";

import { prisma } from "@/lib/prisma";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
    },
  },
}));

describe("loginUser", () => {
  it("logs in valid user", async () => {
    const hashedPassword = await bcrypt.hash("Password123", 10);

    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      id: "1",
      email: "test@gmail.com",
      password: hashedPassword,
    } as never);

    const result = await loginUser("test@gmail.com", "Password123");

    expect(result.user.email).toBe("test@gmail.com");

    expect(result.accessToken).toBeDefined();

    expect(result.refreshToken).toBeDefined();
  });

  it("throws on invalid password", async () => {
    const hashedPassword = await bcrypt.hash("Password123", 10);

    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      id: "1",
      email: "test@gmail.com",
      password: hashedPassword,
    } as never);

    await expect(loginUser("test@gmail.com", "wrong")).rejects.toThrow(
      "INVALID_CREDENTIALS",
    );
  });

  it("throws when user does not exist", async () => {
    vi.mocked(prisma.user.findUnique).mockResolvedValue(null as never);

    await expect(loginUser("missing@gmail.com", "Password123")).rejects.toThrow(
      "INVALID_CREDENTIALS",
    );
  });
});
