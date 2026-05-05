"use client";
import { useUser } from "@/hooks/useUser";
import Footer from "../Footer/Footer";
import Header from "../Header/Header";

export default function LayoutComponent({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, setUser, loaded } = useUser();
  return (
    <>
      <Header setUser={setUser} isLoggedIn={!!user} loaded={loaded} />
      <div className="flex-1">{children}</div>
      <Footer user={user} />
    </>
  );
}
