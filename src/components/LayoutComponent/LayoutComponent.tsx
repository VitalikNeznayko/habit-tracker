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
    const publicPaths = ["/", "/login", "/register"];
    let active = true;

    async function loadUser() {
      try {
        let res = await fetch("/api/auth/me", {
          credentials: "include",
        });

        let user = await res.json();

        if (!user) {
          if (!publicPaths.includes(pathname)) {
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

  return (
    <>
      <Header setUser={setUser} isLoggedIn={!!user} loaded={loaded} />
      <div className="flex-1">{children}</div>
      <Footer user={user} />
    </>
  );
}
