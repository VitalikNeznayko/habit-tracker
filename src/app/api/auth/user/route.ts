import { NextRequest } from "next/server";
import { getUserIdFromToken } from "@/lib/auth";
import { ok, error } from "@/lib/api";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("accessToken")?.value;
  const userId = getUserIdFromToken(token);

  const user = userId
    ? await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          createdAt: true,
        },
      })
    : null;

  return ok(user);
}
export const dynamic = "force-dynamic";
