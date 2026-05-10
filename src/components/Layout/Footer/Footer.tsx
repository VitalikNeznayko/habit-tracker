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
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-base font-semibold text-[#17201b]">
              Habit Tracker
            </p>
          </div>

          <div className="flex flex-wrap gap-5 text-sm text-[#6e7f72]">
            {isLoggedIn ? (
              <>
                <Link
                  href="/dashboard"
                  className="transition hover:text-[#17201b]"
                >
                  Dashboard
                </Link>
                <Link
                  href="/profile"
                  className="transition hover:text-[#17201b]"
                >
                  Profile
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="transition hover:text-[#17201b]"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="transition hover:text-[#17201b]"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
