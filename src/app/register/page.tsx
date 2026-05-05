"use client";

import { useRouter } from "next/navigation";
import AuthForm from "@/components/AuthForm/AuthForm";

export default function RegisterPage() {
  const router = useRouter();

  async function handleRegister(email: string, password: string) {
    if (!email || !password) {
      throw new Error("Fill all fields");
    }

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
      throw new Error(data.error || "Register failed");
    }

    window.location.href = "/dashboard";
  }

  return (
    <AuthForm
      title="Create account"
      subtitle="Start with one habit today. You can add more once your rhythm is set."
      submitLabel="Create account"
      altLinkHref="/login"
      altLinkLabel="Login"
      onSubmit={handleRegister}
    />
  );
}
