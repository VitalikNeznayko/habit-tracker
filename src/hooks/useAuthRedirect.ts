"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function useAuthRedirect() {
  const router = useRouter();

  useEffect(() => {
    let active = true;

    async function checkUser() {
      const res = await fetch("/api/auth/me", {
        credentials: "include",
      });

      if (!active) return;
      if (!res.ok) return;

      const user = await res.json();
      if (user) {
        router.replace("/dashboard");
      }
    }

    checkUser();

    return () => {
      active = false;
    };
  }, [router]);
}
