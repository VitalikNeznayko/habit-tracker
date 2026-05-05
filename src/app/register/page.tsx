"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  async function handleRegister() {
    if (!email || !password) {
      alert("Fill all fields");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Register failed");
        return;
      }

      router.push("/dashboard");
    } catch (e) {
      console.error("REGISTER ERROR:", e);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-[#f6f7f4] px-5 py-10 text-[#17201b]">
      <div className="w-full max-w-md rounded-lg border border-[#dce3dc] bg-white p-6 shadow-sm">
        <Link href="/" className="text-sm font-semibold text-[#6e7f72]">
          Habit Tracker
        </Link>
        <h1 className="mt-5 text-3xl font-bold">Create account</h1>
        <p className="mt-2 text-sm leading-6 text-[#6e7f72]">
          Start with one habit today. You can add more once your rhythm is set.
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
          onClick={handleRegister}
          disabled={loading}
          className="mt-5 w-full rounded-md bg-[#17201b] py-3 text-sm font-semibold text-white transition hover:bg-[#28352d]"
        >
          {loading ? "Creating..." : "Create account"}
        </button>

        <p className="mt-4 text-center text-sm text-[#6e7f72]">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-[#2f6f45]">
            Login
          </Link>
        </p>
      </div>
    </main>
  );
}
