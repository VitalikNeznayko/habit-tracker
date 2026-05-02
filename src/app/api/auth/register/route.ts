import { NextResponse } from "next/server";
import { registerSchema } from "@/lib/validators";
import { registerUser } from "@/services/auth.service";
import { setAuthCookies } from "@/lib/tokens";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 },
      );
    }

    const { email, password } = parsed.data;

    try {
      const { user, accessToken, refreshToken } = await registerUser(
        email,
        password,
      );

      const response = NextResponse.json({
        id: user.id,
        email: user.email,
      });

      setAuthCookies(response, accessToken, refreshToken);

      return response;
    } catch (e: any) {
      if (e.message === "USER_EXISTS") {
        return NextResponse.json(
          { error: "User already exists" },
          { status: 400 },
        );
      }

      throw e;
    }
  } catch (e) {
    console.error("REGISTER ERROR:", e);

    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
