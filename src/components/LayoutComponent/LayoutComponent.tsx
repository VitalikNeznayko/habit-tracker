"use client";
import Footer from "../Footer/Footer";
import Header from "../Header/Header";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

type User = {
  id: string;
  email: string;
};

export default function LayoutComponent({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let active = true;

    async function loadSession() {
      await fetch("/api/auth/refresh", {
        method: "POST",
        credentials: "include",
      });

      const res = await fetch("/api/auth/me", {
        credentials: "include",
      });

      if (!active) return;

      if (res.ok) {
        setUser(await res.json());
      } else {
        setUser(null);
      }

      setLoaded(true);
    }

    loadSession();

    return () => {
      active = false;
    };
  }, [pathname]);

  return (
    <>
      <Header setUser={setUser} isLoggedIn={!!user} loaded={loaded} />
      <div className="flex-1">{children}</div>
      <Footer user={user} />
    </>
  );
}
