"use client";
import AuthForm from "@/components/AuthForm/AuthForm";

export default function LoginPage() {
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
      const data = await res.json();
      throw new Error(data.error || "Login failed");
    }

    window.location.href = "/dashboard";
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
