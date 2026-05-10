import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import { error } from "@/lib/api";

export function getUserIdFromToken(token?: string) {
  if (!token) return null;

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
    };

    return payload.userId;
  } catch {
    return null;
  }
}

export function requireUserId(req: NextRequest): string | NextResponse {
  const token = req.cookies.get("accessToken")?.value;
  const userId = getUserIdFromToken(token);

  if (!userId) return error("Unauthorized", 401);

  return userId;
}
