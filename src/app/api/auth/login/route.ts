import { NextResponse } from "next/server";
import { loginSchema } from "@/lib/validators";
import { loginUser } from "@/services/auth.service";
import { setAuthCookies } from "@/lib/tokens";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 },
      );
    }

    const { email, password } = parsed.data;

    try {
      const { user, accessToken, refreshToken } = await loginUser(
        email,
        password,
      );

      const response = NextResponse.json({
        message: "Logged in",
        id: user.id,
        email: user.email,
      });

      setAuthCookies(response, accessToken, refreshToken);

      return response;
    } catch (e: any) {
      if (e.message === "INVALID_CREDENTIALS") {
        return NextResponse.json(
          { error: "Invalid credentials" },
          { status: 401 },
        );
      }

      throw e;
    }
  } catch (e) {
    console.error("LOGIN ERROR:", e);

    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
