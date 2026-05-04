import { error, ok } from "@/lib/api";
import { loginSchema } from "@/lib/validators";
import { loginUser } from "@/services/auth.service";
import { setAuthCookies } from "@/lib/tokens";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return error(parsed.error.issues[0].message, 400);
    }

    const { email, password } = parsed.data;

    try {
      const { user, accessToken, refreshToken } = await loginUser(
        email,
        password,
      );

      const response = ok({
        message: "Logged in",
        id: user.id,
        email: user.email,
      });

      setAuthCookies(response, accessToken, refreshToken);

      return response;
    } catch (e: unknown) {
      if (e instanceof Error && e.message === "INVALID_CREDENTIALS") {
        return error("Invalid credentials", 401);
      }

      throw e;
    }
  } catch (e) {
    console.error("LOGIN ERROR:", e);

    return error("Server error", 500);
  }
}
