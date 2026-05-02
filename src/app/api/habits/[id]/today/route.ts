import { NextRequest } from "next/server";
import { getUserIdFromToken } from "@/lib/auth";
import { ok, error } from "@/lib/api";
import { getTodayStatus } from "@/services/checkin.service";
import { idParamSchema } from "@/lib/validators";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  const token = req.cookies.get("accessToken")?.value;
  const userId = getUserIdFromToken(token);

  if (!userId) return error("Unauthorized", 401);

  const params = await context.params;

  const parsed = idParamSchema.safeParse(params);

  if (!parsed.success) {
    return error(parsed.error.issues[0].message, 400);
  }

  const { id } = parsed.data;

  try {
    const result = await getTodayStatus(userId, id);
    return ok(result);
  } catch (e: any) {
    console.error("GET TODAY ERROR:", e);

    if (e.message === "NOT_FOUND") return error("Not found", 404);
    return error("Server error", 500);
  }
}
