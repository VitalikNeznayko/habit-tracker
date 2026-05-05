"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function login() {
    if (loading) return;

    setLoading(true);

    const res = await fetch("/api/auth/login", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!res.ok) {
      alert("Invalid credentials");
      setLoading(false);
      return;
    }

    router.replace("/dashboard");
    router.refresh();
  }
  return (
    <main className="grid min-h-screen place-items-center bg-[#f6f7f4] px-5 py-10 text-[#17201b]">
      <div className="w-full max-w-md rounded-lg border border-[#dce3dc] bg-white p-6 shadow-sm">
        <Link href="/" className="text-sm font-semibold text-[#6e7f72]">
          Habit Tracker
        </Link>
        <h1 className="mt-5 text-3xl font-bold">Welcome back</h1>
        <p className="mt-2 text-sm leading-6 text-[#6e7f72]">
          Log in to check off today&apos;s habits and keep your streaks moving.
        </p>

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-6 w-full rounded-md border border-[#cbd4cc] bg-[#fbfcfa] px-3 py-3 text-sm outline-none transition placeholder:text-[#91a094] focus:border-[#3b8f55] focus:bg-white"
        />

        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-3 w-full rounded-md border border-[#cbd4cc] bg-[#fbfcfa] px-3 py-3 text-sm outline-none transition placeholder:text-[#91a094] focus:border-[#3b8f55] focus:bg-white"
        />

        <button
          onClick={login}
          disabled={loading}
          className="mt-5 w-full rounded-md bg-[#17201b] py-3 text-sm font-semibold text-white transition hover:bg-[#28352d]"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="mt-4 text-center text-sm text-[#6e7f72]">
          New here?{" "}
          <Link href="/register" className="font-semibold text-[#2f6f45]">
            Create account
          </Link>
        </p>
      </div>
    </main>
  );
}
