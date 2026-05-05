"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type User = {
  id: string;
  email: string;
};

export function useUser() {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadUser() {
      try {
        let res = await fetch("/api/auth/me", {
          credentials: "include",
        });

        let user = await res.json();

        if (user != null) {
          const refresh = await fetch("/api/auth/refresh", {
            method: "POST",
            credentials: "include",
          });

          if (refresh.ok) {
            res = await fetch("/api/auth/me", {
              credentials: "include",
            });
            user = await res.json();
          }
        }

        if (!active) return;

        setUser(user);
      } catch (error) {
        console.warn("Auth load failed:", error);
        setUser(null);
      } finally {
        setLoaded(true);
      }
    }

    loadUser();

    return () => {
      active = false;
    };
  }, [pathname]);

  return { user, setUser, loaded };
}
