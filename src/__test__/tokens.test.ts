import { describe, expect, it, beforeAll } from "vitest";

import jwt from "jsonwebtoken";

import { getUserIdFromToken } from "@/lib/auth";

import { generateTokens } from "@/lib/tokens";

describe("tokens", () => {
  beforeAll(() => {
    process.env.JWT_SECRET = "test-secret";

    process.env.JWT_REFRESH_SECRET = "refresh-secret";
  });

  it("generates access token", () => {
    const tokens = generateTokens("user-id");

    expect(tokens.accessToken).toBeDefined();

    expect(tokens.refreshToken).toBeDefined();
  });

  it("extracts user id", () => {
    const token = jwt.sign({ userId: "123" }, process.env.JWT_SECRET!);

    const userId = getUserIdFromToken(token);

    expect(userId).toBe("123");
  });

  it("returns null for invalid token", () => {
    const result = getUserIdFromToken("invalid");

    expect(result).toBeNull();
  });
});
