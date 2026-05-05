"use client";

import { useRouter } from "next/navigation";
import AuthForm from "@/components/AuthForm/AuthForm";

export default function LoginPage() {
  const router = useRouter();

  async function handleLogin(email: string, password: string) {
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
      return;
    }

    router.replace("/dashboard");
  }

  return (
    <AuthForm
      title="Welcome back"
      subtitle="Log in to check off today's habits and keep your streaks moving."
      submitLabel="Login"
      altLinkHref="/register"
      altLinkLabel="Create account"
      onSubmit={handleLogin}
    />
  );
}
