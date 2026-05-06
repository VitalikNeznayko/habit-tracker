import { NextRequest } from "next/server";
import bcrypt from "bcrypt";

import { prisma } from "@/lib/prisma";
import { ok, error } from "@/lib/api";
import { getUserIdFromToken } from "@/lib/auth";
import { changePasswordSchema } from "@/lib/validators";

export async function PATCH(req: NextRequest) {
  try {
    const token = req.cookies.get("accessToken")?.value;
    
    const userId = getUserIdFromToken(token);

    if (!userId) {
      return error("Unauthorized", 401);
    }

    const body = await req.json();

    const result = changePasswordSchema.safeParse(body);

    if (!result.success) {
      return error(result.error.issues[0].message, 400);
    }

    const { currentPassword, newPassword } = result.data;

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return error("Unauthorized", 401);
    }

    const passwordMatches = await bcrypt.compare(
      currentPassword,
      user.password,
    );

    if (!passwordMatches) {
      return error("Current password is incorrect", 400);
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
      },
    });

    return ok({
      message: "Password updated",
    });
  } catch {
    return error("Server error", 500);
  }
}

export const dynamic = "force-dynamic";
