"use client";

import { useEffect } from "react";

export default function GlobalError({
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
    <html lang="uk">
      <body className="flex min-h-screen items-center justify-center bg-[#f6f7f4] px-5 py-10 text-[#17201b] antialiased">
        <div className="w-full max-w-md rounded-lg border border-[#dce3dc] bg-white p-6 text-center shadow-sm">
          <p className="text-sm font-semibold uppercase text-[#8a2f2f]">
            Critical error
          </p>

          <h1 className="mt-2 text-3xl font-bold">Something broke</h1>

          <p className="mt-3 text-sm leading-6 text-[#6e7f72]">
            The application crashed unexpectedly. Try reloading the page.
          </p>

          {error.digest ? (
            <p className="mt-3 text-xs text-[#91a094]">
              Reference: {error.digest}
            </p>
          ) : null}

          <button
            onClick={() => unstable_retry()}
            className="mt-6 rounded-md bg-[#2f6f45] px-5 py-3 text-sm font-semibold text-white shadow-sm ring-1 ring-[#255a38] transition hover:bg-[#285f3b]"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
