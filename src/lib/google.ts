import { Issuer } from "openid-client";

export async function getGoogleClient() {
  const googleIssuer = await Issuer.discover("https://accounts.google.com");

  return new googleIssuer.Client({
    client_id: process.env.GOOGLE_CLIENT_ID!,
    client_secret: process.env.GOOGLE_CLIENT_SECRET!,
    redirect_uris: [
      `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/google/callback`,
    ],
    response_types: ["code"],
  });
}
