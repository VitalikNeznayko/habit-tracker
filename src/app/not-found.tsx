import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-[calc(100vh-160px)] place-items-center bg-[#f6f7f4] px-5 py-10 text-[#17201b]">
      <div className="w-full max-w-md rounded-lg border border-[#dce3dc] bg-white p-6 text-center shadow-sm">
        <p className="text-sm font-semibold uppercase text-[#6e7f72]">404</p>

        <h1 className="mt-2 text-3xl font-bold">Page not found</h1>

        <p className="mt-3 text-sm leading-6 text-[#6e7f72]">
          The page you are looking for doesn&apos;t exist or has been moved.
        </p>

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="rounded-md bg-[#2f6f45] px-5 py-3 text-sm font-semibold text-white shadow-sm ring-1 ring-[#255a38] transition hover:bg-[#285f3b]"
          >
            Go back home
          </Link>

          <Link
            href="/dashboard"
            className="rounded-md border border-[#cbd4cc] bg-white px-5 py-3 text-sm font-semibold text-[#17201b] transition hover:border-[#9fab9f]"
          >
            Open dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
