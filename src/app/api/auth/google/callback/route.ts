import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getGoogleClient } from "@/lib/google";
import { generateTokens, setAuthCookies } from "@/lib/tokens";

export async function GET(req: NextRequest) {
  try {
    const client = await getGoogleClient();

    const params = client.callbackParams(req.url);

    const storedState = req.cookies.get("google_oauth_state")?.value;

    const tokenSet = await client.callback(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/google/callback`,
      params,
      {
        state: storedState,
      },
    );

    const userinfo = await client.userinfo(tokenSet.access_token!);

    if (!userinfo.email) {
      return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/login`);
    }

    let user = await prisma.user.findUnique({
      where: {
        email: userinfo.email,
      },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: userinfo.email,
          password: "",
        },
      });
    }
    const { accessToken, refreshToken } = generateTokens(user.id);

    const response = NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
    );

    setAuthCookies(response, accessToken, refreshToken);

    return response;
  } catch (error) {
    console.error(error);

    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/login`);
  }
}
