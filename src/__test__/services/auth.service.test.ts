import bcrypt from "bcrypt";

import { loginUser } from "@/services/auth.service";

import { prisma } from "@/lib/prisma";

jest.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
    },
  },
}));

describe("loginUser", () => {
  it("logs in valid user", async () => {
    const hashedPassword = await bcrypt.hash("Password123", 10);

    (prisma.user.findUnique as jest.Mock).mockResolvedValue({
      id: "1",
      email: "test@gmail.com",
      password: hashedPassword,
    });

    const result = await loginUser("test@gmail.com", "Password123");

    expect(result.user.email).toBe("test@gmail.com");

    expect(result.accessToken).toBeDefined();

    expect(result.refreshToken).toBeDefined();
  });

  it("throws on invalid password", async () => {
    const hashedPassword = await bcrypt.hash("Password123", 10);

    (prisma.user.findUnique as jest.Mock).mockResolvedValue({
      id: "1",
      email: "test@gmail.com",
      password: hashedPassword,
    });

    await expect(loginUser("test@gmail.com", "wrong")).rejects.toThrow(
      "INVALID_CREDENTIALS",
    );
  });

  it("throws when user does not exist", async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

    await expect(loginUser("missing@gmail.com", "Password123")).rejects.toThrow(
      "INVALID_CREDENTIALS",
    );
  });
});
