"use client";

import Link from "next/link";
import { useState } from "react";
import { Loader } from "@/components/Loader/Loader";

type HabitCardProps = {
  id: string;
  title: string;
  description?: string | null;
  todayCompleted: boolean;
  currentStreak: number;
  onToggle: (id: string) => void;
};

export default function HabitCard({
  id,
  title,
  description,
  todayCompleted,
  currentStreak,
  onToggle,
}: HabitCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const done = todayCompleted;
  const streak = currentStreak;

  async function handleToggle() {
    if (isLoading) return;

    setIsLoading(true);
    try {
      await Promise.resolve(onToggle(id));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <article
      className={`flex flex-col gap-4 rounded-lg border p-4 shadow-sm transition-all duration-200 sm:flex-row sm:items-center sm:justify-between sm:p-5 ${
        done ? "border-[#cde8d3] bg-[#f1fbf3]" : "border-[#dce3dc] bg-white"
      }`}
    >
      <div className="flex min-w-0 items-start gap-3 sm:items-center">
        <button
          onClick={handleToggle}
          disabled={isLoading}
          aria-label={`Toggle ${title}`}
          className={`grid h-11 w-11 shrink-0 place-items-center rounded-md border text-sm font-bold transition-all duration-200 sm:h-9 sm:w-9 sm:text-xs ${
            isLoading ? "opacity-50" : ""
          } ${
            done
              ? "border-[#3b8f55] bg-[#3b8f55] text-white scale-100"
              : "border-[#cbd4cc] bg-white text-transparent hover:border-[#3b8f55]"
          }`}
        >
          {isLoading ? <Loader size="sm" /> : "✓"}
        </button>

        <div className="min-w-0">
          <h2
            className={`text-base font-semibold leading-6 transition-all duration-200 sm:truncate ${
              done ? "text-[#6e7f72] line-through" : ""
            }`}
          >
            {title}
          </h2>

          <p className="mt-1 text-sm leading-5 text-[#6e7f72]">
            {description || (done ? "Completed today" : "Waiting for today")}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
        <span className="rounded-md bg-[#eef3ef] px-3 py-2 text-sm font-semibold text-[#3c493f]">
          {streak} day streak
        </span>

        <Link
          href={`/habit/${id}`}
          className="inline-flex min-h-11 items-center justify-center rounded-md border border-[#cbd4cc] bg-white px-4 py-2 text-sm font-semibold transition hover:border-[#9fab9f] sm:min-h-10 sm:px-3"
        >
          Details
        </Link>
      </div>
    </article>
  );
}
