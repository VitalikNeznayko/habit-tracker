import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
  const refreshToken = req.cookies.get("refreshToken")?.value;

  if (!refreshToken) {
    return Response.json({ error: "No refresh token" }, { status: 401 });
  }

  try {
    const payload = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET!,
    ) as { userId: string };

    const newAccessToken = jwt.sign(
      { userId: payload.userId },
      process.env.JWT_SECRET!,
      { expiresIn: "15m" },
    );

    return new Response(JSON.stringify({ message: "Token refreshed" }), {
      headers: {
        "Set-Cookie": `accessToken=${newAccessToken}; HttpOnly; Path=/; Max-Age=900; SameSite=Lax`,
      },
    });
  } catch {
    return Response.json({ error: "Invalid refresh token" }, { status: 401 });
  }
}
