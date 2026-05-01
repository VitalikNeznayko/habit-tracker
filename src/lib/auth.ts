import jwt from "jsonwebtoken";

export function getUserIdFromToken(token: string) {
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
    };

    return payload.userId;
  } catch {
    return null;
  }
}
