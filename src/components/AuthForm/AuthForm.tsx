"use client";

import Link from "next/link";
import { useState } from "react";
import { loginSchema, registerSchema } from "@/lib/validators";
import { Loader } from "@/components/Loader/Loader";

type AuthFormProps = {
  title: string;
  subtitle: string;
  submitLabel: string;
  altLinkHref: string;
  altLinkLabel: string;
  onSubmit: (email: string, password: string) => Promise<void>;
};

export default function AuthForm({
  title,
  subtitle,
  submitLabel,
  altLinkHref,
  altLinkLabel,
  onSubmit,
}: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit() {
    if (loading) return;

    setError("");

    const schema = title === "Welcome back" ? loginSchema : registerSchema;

    const result = schema.safeParse({
      email,
      password,
    });

    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }

    setLoading(true);

    try {
      await onSubmit(result.data.email, result.data.password);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
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

        <h1 className="mt-5 text-3xl font-bold">{title}</h1>

        <p className="mt-2 text-sm leading-6 text-[#6e7f72]">{subtitle}</p>

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSubmit();
          }}
          className="mt-6 w-full rounded-md border border-[#cbd4cc] bg-[#fbfcfa] px-3 py-3 text-sm outline-none transition placeholder:text-[#91a094] focus:border-[#3b8f55] focus:bg-white"
          suppressHydrationWarning
        />

        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSubmit();
          }}
          className="mt-3 w-full rounded-md border border-[#cbd4cc] bg-[#fbfcfa] px-3 py-3 text-sm outline-none transition placeholder:text-[#91a094] focus:border-[#3b8f55] focus:bg-white"
          suppressHydrationWarning
        />

        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="mt-5 w-full rounded-md bg-[#17201b] py-3 text-sm font-semibold text-white transition hover:bg-[#28352d] disabled:cursor-not-allowed disabled:opacity-60"
          suppressHydrationWarning
        >
          {loading ? <Loader size="sm" label={`${submitLabel}...`} /> : submitLabel}
        </button>

        <p className="mt-4 text-center text-sm text-[#6e7f72]">
          {title === "Welcome back" ? "New here?" : "Already have an account?"}{" "}
          <Link href={altLinkHref} className="font-semibold text-[#2f6f45]">
            {altLinkLabel}
          </Link>
        </p>
        <a
          href="/api/auth/google"
          className="mt-3 flex w-full items-center justify-center rounded-md border border-[#cbd4cc] bg-white py-3 text-sm font-semibold transition hover:border-[#9fab9f]"
        >
          Continue with Google
        </a>
      </div>
    </main>
  );
}
