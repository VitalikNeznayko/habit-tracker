"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

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
  const [menuOpen, setMenuOpen] = useState(false);

  async function logout() {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    setUser(null);
    setMenuOpen(false);
    window.location.href = "/login";
  }

  return (
    <header className="sticky top-0 z-40 border-b border-[#dce3dc]/60 bg-[#f6f7f4]/85 px-4 py-3 backdrop-blur-md backdrop-saturate-150 sm:px-8 sm:py-4">
      <nav className="mx-auto max-w-6xl">
        <div className="flex items-center justify-between gap-3 md:hidden">
          <Link
            href="/"
            className="text-lg font-semibold tracking-tight text-[#17201b]"
          >
            Habit Tracker
          </Link>

          <button
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-[#cbd4cc] bg-white text-[#17201b] shadow-sm transition hover:border-[#9fab9f] md:hidden"
          >
            <span className="sr-only">
              {menuOpen ? "Close menu" : "Open menu"}
            </span>
            <span className="flex w-5 flex-col gap-1.5">
              <span
                className={`h-0.5 rounded-full bg-current transition ${
                  menuOpen ? "translate-y-2 rotate-45" : ""
                }`}
              />
              <span
                className={`h-0.5 rounded-full bg-current transition ${
                  menuOpen ? "opacity-0" : ""
                }`}
              />
              <span
                className={`h-0.5 rounded-full bg-current transition ${
                  menuOpen ? "-translate-y-2 -rotate-45" : ""
                }`}
              />
            </span>
          </button>
        </div>

        <div className="hidden md:grid md:grid-cols-3 md:items-center md:gap-4">
          <Link
            href="/"
            className="text-lg font-semibold tracking-tight text-[#17201b]"
          >
            Habit Tracker
          </Link>

          <div className="flex items-center justify-center gap-1">
            {isLoggedIn && (
              <>
                <Link
                  href="/dashboard"
                  className={`${navClass(pathname === "/dashboard")} min-h-0 py-2`}
                >
                  Dashboard
                </Link>
                <Link
                  href="/profile"
                  className={`${navClass(pathname === "/profile")} min-h-0 py-2`}
                >
                  Profile
                </Link>
              </>
            )}
          </div>

          <div className="flex items-center justify-end gap-2">
            {isLoggedIn ? (
              <button
                onClick={logout}
                className="inline-flex items-center justify-center rounded-md border border-[#cbd4cc] bg-white px-4 py-2 text-sm font-semibold text-[#3c493f] transition hover:border-[#9fab9f]"
              >
                Logout
              </button>
            ) : loaded ? (
              <>
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-semibold text-[#435248] transition hover:bg-white hover:text-[#17201b]"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center rounded-md bg-[#2f6f45] px-4 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-[#255a38] transition hover:bg-[#285f3b]"
                >
                  Start
                </Link>
              </>
            ) : null}
          </div>
        </div>

        {menuOpen && (
          <div className="mt-3 rounded-2xl border border-[#dce3dc] bg-white p-3 shadow-lg md:hidden">
            <div className="flex flex-col gap-2">
              {isLoggedIn && (
                <>
                  <Link
                    href="/dashboard"
                    className={navClass(pathname === "/dashboard")}
                    onClick={() => setMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/profile"
                    className={navClass(pathname === "/profile")}
                    onClick={() => setMenuOpen(false)}
                  >
                    Profile
                  </Link>
                </>
              )}

              {isLoggedIn ? (
                <button
                  onClick={logout}
                  className="inline-flex min-h-11 items-center justify-center rounded-md border border-[#cbd4cc] bg-[#f8faf8] px-4 py-2 text-sm font-semibold text-[#3c493f] transition hover:border-[#9fab9f]"
                >
                  Logout
                </button>
              ) : loaded ? (
                <>
                  <Link
                    href="/login"
                    className="inline-flex min-h-11 items-center justify-center rounded-md border border-transparent px-4 py-2 text-sm font-semibold text-[#435248] transition hover:bg-[#f6f7f4] hover:text-[#17201b]"
                    onClick={() => setMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="inline-flex min-h-11 items-center justify-center rounded-md bg-[#2f6f45] px-4 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-[#255a38] transition hover:bg-[#285f3b]"
                    onClick={() => setMenuOpen(false)}
                  >
                    Start
                  </Link>
                </>
              ) : null}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

export default Header;
