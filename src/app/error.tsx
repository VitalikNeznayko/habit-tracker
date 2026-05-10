"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="grid min-h-[calc(100vh-160px)] place-items-center bg-[#f6f7f4] px-5 py-10 text-[#17201b]">
      <div className="w-full max-w-md rounded-lg border border-[#dce3dc] bg-white p-6 text-center shadow-sm">
        <p className="text-sm font-semibold uppercase text-[#8a2f2f]">Error</p>

        <h1 className="mt-2 text-3xl font-bold">Something went wrong</h1>

        <p className="mt-3 text-sm leading-6 text-[#6e7f72]">
          We couldn&apos;t finish loading this page. Try again, or head back to
          your dashboard.
        </p>

        {error.digest ? (
          <p className="mt-3 text-xs text-[#91a094]">
            Reference: {error.digest}
          </p>
        ) : null}

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button
            onClick={() => unstable_retry()}
            className="rounded-md bg-[#2f6f45] px-5 py-3 text-sm font-semibold text-white shadow-sm ring-1 ring-[#255a38] transition hover:bg-[#285f3b]"
          >
            Try again
          </button>

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
