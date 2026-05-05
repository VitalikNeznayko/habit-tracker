import { prisma } from "@/lib/prisma";
import { generateTokens } from "@/lib/tokens";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function loginUser(email: string, password: string) {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) throw new Error("INVALID_CREDENTIALS");

  const bcryptStart = Date.now();
  const isValid = await bcrypt.compare(password, user.password);

  if (!isValid) throw new Error("INVALID_CREDENTIALS");

  const { accessToken, refreshToken } = generateTokens(user.id);

  return {
    user,
    accessToken,
    refreshToken,
  };
}

export async function registerUser(email: string, password: string) {
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new Error("USER_EXISTS");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
    },
  });

  const { accessToken, refreshToken } = generateTokens(user.id);

  return {
    user,
    accessToken,
    refreshToken,
  };
}

export function refreshUser(refreshToken: string) {
  try {
    const payload = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET!,
    ) as { userId: string };

    const tokens = generateTokens(payload.userId);

    return tokens;
  } catch {
    throw new Error("INVALID_TOKEN");
  }
}
