"use client";

import Link from "next/link";

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
  const done = todayCompleted;
  const streak = currentStreak;

  function handleToggle() {
    onToggle(id);
  }

  return (
    <article
      className={`flex flex-col gap-4 rounded-lg border p-4 shadow-sm transition-all duration-200 sm:flex-row sm:items-center sm:justify-between ${
        done ? "border-[#cde8d3] bg-[#f1fbf3]" : "border-[#dce3dc] bg-white"
      }`}
    >
      <div className="flex min-w-0 items-center gap-3">
        <button
          onClick={handleToggle}
          aria-label={`Toggle ${title}`}
          className={`grid h-9 w-9 shrink-0 place-items-center rounded-md border text-xs font-bold transition-all duration-200 ${
            done
              ? "border-[#3b8f55] bg-[#3b8f55] text-white scale-100"
              : "border-[#cbd4cc] bg-white text-transparent hover:border-[#3b8f55]"
          }`}
        >
          ✓
        </button>

        <div className="min-w-0">
          <h2
            className={`truncate text-base font-semibold transition-all duration-200 ${
              done ? "text-[#6e7f72] line-through" : ""
            }`}
          >
            {title}
          </h2>

          <p className="text-sm text-[#6e7f72]">
            {description || (done ? "Completed today" : "Waiting for today")}
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 sm:justify-end">
        <span className="rounded-md bg-[#eef3ef] px-3 py-2 text-sm font-semibold text-[#3c493f]">
          {streak} day streak
        </span>

        <Link
          href={`/habit/${id}`}
          className="rounded-md border border-[#cbd4cc] bg-white px-3 py-2 text-sm font-semibold transition hover:border-[#9fab9f]"
        >
          Details
        </Link>
      </div>
    </article>
  );
}
