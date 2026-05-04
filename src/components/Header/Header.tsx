import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
type User = {
  id: string;
  email: string;
};

function navClass(active: boolean) {
  return active
    ? "rounded-md bg-white px-4 py-2 text-sm font-semibold text-[#17201b] shadow-sm"
    : "rounded-md px-4 py-2 text-sm font-semibold text-[#526056] transition hover:bg-white hover:text-[#17201b]";
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
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    router.replace("/login");
  }
  return (
    <header className="border-b border-[#dce3dc] bg-[#f6f7f4]/95 px-5 py-4 sm:px-8">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4">
        <Link href="/" className="text-lg font-semibold">
          Habit Tracker
        </Link>

        <div className="flex flex-wrap items-center justify-end gap-2">
          {isLoggedIn ? (
            <>
              <Link
                href="/profile"
                className={navClass(pathname === "/profile")}
              >
                Profile
              </Link>
              <button
                onClick={logout}
                className="rounded-md border border-[#cbd4cc] bg-white px-4 py-2 text-sm font-semibold text-[#3c493f] transition hover:border-[#9fab9f]"
              >
                Logout
              </button>
            </>
          ) : loaded ? (
            <>
              <Link
                href="/dashboard"
                className={navClass(pathname === "/dashboard")}
              >
                Dashboard
              </Link>
              <Link
                href="/login"
                className="rounded-md px-4 py-2 text-sm font-semibold text-[#435248] transition hover:bg-white hover:text-[#17201b]"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="rounded-md bg-[#2f6f45] px-4 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-[#255a38] transition hover:bg-[#285f3b]"
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
