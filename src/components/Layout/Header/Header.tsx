"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
type User = {
  id: string;
  email: string;
};

function navClass(active: boolean) {
  return active
    ? "inline-flex min-h-11 items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-semibold text-[#17201b] shadow-sm"
    : "inline-flex min-h-11 items-center justify-center rounded-md px-4 py-2 text-sm font-semibold text-[#526056] transition hover:bg-white hover:text-[#17201b]";
}

function Header({
  setUser,
  isLoggedIn,
  loaded,
}: {
  setUser: (user: User | null) => void;
  isLoggedIn: boolean;
  loaded: boolean;
}) {
  const pathname = usePathname();
  async function logout() {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    setUser(null);
    window.location.href = "/login";
  }
  return (
    <header className="sticky top-0 z-40 border-b border-[#dce3dc]/60 bg-[#f6f7f4]/85 px-4 py-3 backdrop-blur-md backdrop-saturate-150 sm:px-8 sm:py-4">
      <nav className="mx-auto grid max-w-6xl grid-cols-1 gap-3 sm:grid-cols-[1fr_auto] sm:items-center md:grid-cols-3">
        <Link
          href="/"
          className="justify-self-start text-lg font-semibold tracking-tight text-[#17201b]"
        >
          Habit Tracker
        </Link>

        <div className="order-3 flex w-full items-center gap-2 overflow-x-auto pb-1 sm:order-2 sm:justify-center sm:pb-0">
          {isLoggedIn && (
            <>
              <Link
                href="/dashboard"
                className={`${navClass(pathname === "/dashboard")} shrink-0`}
              >
                Dashboard
              </Link>
              <Link
                href="/profile"
                className={`${navClass(pathname === "/profile")} shrink-0`}
              >
                Profile
              </Link>
            </>
          )}
        </div>

        <div className="order-2 flex items-center justify-end gap-2 sm:order-3">
          {isLoggedIn ? (
            <button
              onClick={logout}
              className="inline-flex min-h-11 items-center justify-center rounded-md border border-[#cbd4cc] bg-white px-4 py-2 text-sm font-semibold text-[#3c493f] transition hover:border-[#9fab9f]"
            >
              Logout
            </button>
          ) : loaded ? (
            <>
              <Link
                href="/login"
                className="inline-flex min-h-11 items-center justify-center rounded-md px-4 py-2 text-sm font-semibold text-[#435248] transition hover:bg-white hover:text-[#17201b]"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="inline-flex min-h-11 items-center justify-center rounded-md bg-[#2f6f45] px-4 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-[#255a38] transition hover:bg-[#285f3b]"
              >
                Start
              </Link>
            </>
          ) : null}
        </div>
      </nav>
    </header>
  );
}

export default Header;
