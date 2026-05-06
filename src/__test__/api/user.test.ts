import { beforeEach, describe, expect, it, vi } from "vitest";

import { GET } from "@/app/api/auth/user/route";

import { prisma } from "@/lib/prisma";

import { getUserIdFromToken } from "@/lib/auth";

import { refreshUser } from "@/services/auth.service";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
    },
  },
}));

vi.mock("@/lib/auth", () => ({
  getUserIdFromToken: vi.fn(),
}));

vi.mock("@/services/auth.service", () => ({
  refreshUser: vi.fn(),
}));

describe("GET /api/auth/user", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns authenticated user", async () => {
    vi.mocked(getUserIdFromToken).mockReturnValue("user-id");

    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      id: "user-id",
      email: "test@gmail.com",
      password: "hashed",
      createdAt: new Date(),
    } as never);

    const request = {
      cookies: {
        get: (name: string) => {
          if (name === "accessToken") {
            return {
              value: "access-token",
            };
          }

          return undefined;
        },
      },
    } as never;

    const response = await GET(request);

    expect(response.status).toBe(200);

    const data = await response.json();

    expect(data.email).toBe("test@gmail.com");
  });

  it("returns null when unauthorized", async () => {
    vi.mocked(getUserIdFromToken).mockReturnValue(null);

    const request = {
      cookies: {
        get: () => undefined,
      },
    } as never;

    const response = await GET(request);

    expect(response.status).toBe(200);

    const data = await response.json();

    expect(data).toBeNull();
  });

  it("refreshes tokens", async () => {
    vi.mocked(getUserIdFromToken)

      // first call
      .mockReturnValueOnce(null)

      // second call
      .mockReturnValueOnce("user-id");

    vi.mocked(refreshUser).mockReturnValue({
      accessToken: "new-access",

      refreshToken: "new-refresh",
    });

    vi.mocked(prisma.user.findUnique).mockResolvedValue({
      id: "user-id",
      email: "test@gmail.com",
      password: "hashed",
      createdAt: new Date(),
    } as never);

    const request = {
      cookies: {
        get: (name: string) => {
          if (name === "refreshToken") {
            return {
              value: "refresh-token",
            };
          }

          return undefined;
        },
      },
    } as never;

    const response = await GET(request);

    expect(response.status).toBe(200);
  });

  it("returns 401 for invalid refresh token", async () => {
    vi.mocked(getUserIdFromToken).mockReturnValue(null);

    vi.mocked(refreshUser).mockImplementation(() => {
      throw new Error();
    });

    const request = {
      cookies: {
        get: (name: string) => {
          if (name === "refreshToken") {
            return {
              value: "invalid",
            };
          }

          return undefined;
        },
      },
    } as never;

    const response = await GET(request);

    expect(response.status).toBe(401);
  });
});
