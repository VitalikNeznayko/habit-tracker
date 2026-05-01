import { NextResponse } from "next/server";

export const ok = (data: any) => NextResponse.json(data);

export const error = (msg: string, status = 400) =>
  NextResponse.json({ error: msg }, { status });
