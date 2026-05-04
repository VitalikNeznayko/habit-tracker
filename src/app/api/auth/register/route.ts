import { error, ok } from "@/lib/api";
import { registerSchema } from "@/lib/validators";
import { registerUser } from "@/services/auth.service";
import { setAuthCookies } from "@/lib/tokens";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return error(parsed.error.issues[0].message, 400);
    }

    const { email, password } = parsed.data;

    try {
      const { user, accessToken, refreshToken } = await registerUser(
        email,
        password,
      );

      const response = ok({
        id: user.id,
        email: user.email,
      });

      setAuthCookies(response, accessToken, refreshToken);

      return response;
    } catch (e: unknown) {
      if (e instanceof Error && e.message === "USER_EXISTS") {
        return error("User already exists", 400);
      }

      throw e;
    }
  } catch (e) {
    console.error("REGISTER ERROR:", e);

    return error("Server error", 500);
  }
}
export const dynamic = "force-dynamic";
