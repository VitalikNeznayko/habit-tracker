"use client";

import Link from "next/link";

type User = {
  id: string;
  email: string;
};

export default function Footer({ user }: { user: User | null }) {
  const isLoggedIn = Boolean(user);

  return (
    <footer className="border-t border-[#dce3dc] bg-[#f6f7f4] px-5 py-8 sm:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 text-sm text-[#6e7f72] sm:flex-row sm:items-center sm:justify-between">
        <p className="font-semibold text-[#17201b]">Habit Tracker</p>
        <div className="flex flex-wrap gap-4">
          {isLoggedIn ? (
            <>
              <Link href="/dashboard" className="hover:text-[#17201b]">
                Dashboard
              </Link>
              <Link href="/profile" className="hover:text-[#17201b]">
                Profile
              </Link>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:text-[#17201b]">
                Login
              </Link>
              <Link href="/register" className="hover:text-[#17201b]">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </footer>
  );
}
