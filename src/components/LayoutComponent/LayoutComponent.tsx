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

    fetch("/api/auth/me").then(async (res) => {
      if (!active) return;

      if (!res.ok) {
        setUser(null);
      } else {
        setUser(await res.json());
      }

      setLoaded(true);
    });

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
