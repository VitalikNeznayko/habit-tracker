import { NextResponse } from "next/server";
import { generators } from "openid-client";

import { getGoogleClient } from "@/lib/google";

export async function GET() {
  const client = await getGoogleClient();

  const state = generators.state();

  const url = client.authorizationUrl({
    scope: "openid email profile",
    state,
    prompt: "select_account",
  });
  const response = NextResponse.redirect(url);

  response.cookies.set("google_oauth_state", state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 10,
  });

  return response;
}
