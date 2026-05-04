"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type Habit = {
  id: string;
  title: string;
  description?: string | null;
};

export default function HabitPage() {
  const params = useParams();
  const id = params.id as string;

  const [habit, setHabit] = useState<Habit | null>(null);
  const [today, setToday] = useState(false);
  const [streak, setStreak] = useState(0);
  const [longest, setLongest] = useState(0);
  const [progress, setProgress] = useState(0);

  async function loadData(habitId: string) {
    const res = await fetch(`/api/habits/${habitId}`);
    const habitData = await res.json();

    const todayRes = await fetch(`/api/habits/${habitId}/today`).then((r) =>
      r.json(),
    );

    const streakRes = await fetch(`/api/habits/${habitId}/streak`).then((r) =>
      r.json(),
    );

    const longestRes = await fetch(
      `/api/habits/${habitId}/longest-streak`,
    ).then((r) => r.json());

    const progressRes = await fetch(`/api/habits/${habitId}/progress`).then((r) =>
      r.json(),
    );

    return {
      habit: habitData as Habit,
      today: Boolean(todayRes.completed),
      streak: Number(streakRes.streak || 0),
      longest: Number(longestRes.longestStreak || 0),
      progress: Number(progressRes.percent || 0),
    };
  }

  async function refresh() {
    const data = await loadData(id);

    setHabit(data.habit);
    setToday(data.today);
    setStreak(data.streak);
    setLongest(data.longest);
    setProgress(data.progress);
  }

  useEffect(() => {
    if (!id) return;

    let active = true;

    loadData(id).then((data) => {
      if (!active) return;

      setHabit(data.habit);
      setToday(data.today);
      setStreak(data.streak);
      setLongest(data.longest);
      setProgress(data.progress);
    });

    return () => {
      active = false;
    };
  }, [id]);

  async function toggle() {
    await fetch("/api/checkins", {
      method: "POST",
      body: JSON.stringify({ habitId: id }),
      headers: { "Content-Type": "application/json" },
    });

    refresh();
  }

  if (!habit) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#f6f7f4] px-5 text-[#17201b]">
        <div className="rounded-lg border border-[#dce3dc] bg-white px-5 py-4 text-sm font-semibold shadow-sm">
          Loading habit...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f6f7f4] px-5 py-6 text-[#17201b] sm:px-8">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/dashboard"
          className="inline-flex rounded-md border border-[#cbd4cc] bg-white px-3 py-2 text-sm font-semibold text-[#3c493f] transition hover:border-[#9fab9f]"
        >
          Back to dashboard
        </Link>

        <section className="mt-6 rounded-lg border border-[#dce3dc] bg-white p-5 shadow-sm sm:p-7">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#6e7f72]">
                Habit details
              </p>
              <h1 className="mt-2 text-4xl font-bold tracking-tight">
                {habit.title}
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-[#6e7f72]">
                {habit.description || "No description yet."}
              </p>
            </div>
            <button
              onClick={toggle}
              className={`rounded-md px-5 py-3 text-sm font-semibold text-white transition ${
                today
                  ? "bg-[#3b8f55] hover:bg-[#327948]"
                  : "bg-[#17201b] hover:bg-[#28352d]"
              }`}
            >
              {today ? "Completed today" : "Mark as done"}
            </button>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg border border-[#eef1ee] bg-[#fbfcfa] p-4">
              <p className="text-sm font-medium text-[#6e7f72]">
                Current streak
              </p>
              <p className="mt-2 text-3xl font-bold">{streak} days</p>
            </div>
            <div className="rounded-lg border border-[#eef1ee] bg-[#fbfcfa] p-4">
              <p className="text-sm font-medium text-[#6e7f72]">
                Longest streak
              </p>
              <p className="mt-2 text-3xl font-bold">{longest} days</p>
            </div>
            <div className="rounded-lg border border-[#eef1ee] bg-[#fbfcfa] p-4">
              <p className="text-sm font-medium text-[#6e7f72]">
                30-day progress
              </p>
              <p className="mt-2 text-3xl font-bold">{progress}%</p>
            </div>
          </div>

          <div className="mt-8">
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="font-semibold text-[#3c493f]">
                Progress over the last 30 days
              </span>
              <span className="text-[#6e7f72]">{progress}%</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-[#edf0ed]">
              <div
                className="h-full rounded-full bg-[#3b8f55] transition-all"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
