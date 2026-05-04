"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Habit = {
  id: string;
  title: string;
  description?: string | null;
};

export default function Dashboard() {
  const router = useRouter();
  const [habits, setHabits] = useState<Habit[]>([]);
  const [todayMap, setTodayMap] = useState<Record<string, boolean>>({});
  const [streakMap, setStreakMap] = useState<Record<string, number>>({});
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  async function loadData() {
    const res = await fetch("/api/habits");

    if (res.status === 401) {
      return { unauthorized: true as const };
    }

    const data = await res.json();
    const today: Record<string, boolean> = {};
    const streak: Record<string, number> = {};

    await Promise.all(
      data.map(async (habit: Habit) => {
        const todayRes = await fetch(`/api/habits/${habit.id}/today`).then(
          (r) => r.json(),
        );
        const streakRes = await fetch(`/api/habits/${habit.id}/streak`).then(
          (r) => r.json(),
        );

        today[habit.id] = todayRes.completed;
        streak[habit.id] = streakRes.streak;
      }),
    );

    return {
      unauthorized: false as const,
      habits: data as Habit[],
      today,
      streak,
    };
  }

  async function refresh() {
    const data = await loadData();

    if (data.unauthorized) {
      router.replace("/login");
      return;
    }

    setHabits(data.habits);
    setTodayMap(data.today);
    setStreakMap(data.streak);
  }

  useEffect(() => {
    let active = true;

    loadData().then((data) => {
      if (!active) return;

      if (data.unauthorized) {
        router.replace("/login");
        return;
      }

      setHabits(data.habits);
      setTodayMap(data.today);
      setStreakMap(data.streak);
    });

    return () => {
      active = false;
    };
  }, [router]);

  async function toggle(id: string) {
    await fetch("/api/checkins", {
      method: "POST",
      body: JSON.stringify({ habitId: id }),
      headers: { "Content-Type": "application/json" },
    });

    refresh();
  }

  async function addHabit() {
    if (!title.trim()) return;

    await fetch("/api/habits", {
      method: "POST",
      body: JSON.stringify({ title, description }),
      headers: { "Content-Type": "application/json" },
    });

    setTitle("");
    setDescription("");
    refresh();
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/login");
  }

  const completedToday = habits.filter((habit) => todayMap[habit.id]).length;
  const totalStreak = habits.reduce(
    (sum, habit) => sum + (streakMap[habit.id] || 0),
    0,
  );
  const completionPercent = habits.length
    ? Math.round((completedToday / habits.length) * 100)
    : 0;

  return (
    <main className="min-h-screen bg-[#f6f7f4] px-5 py-6 text-[#17201b] sm:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase text-[#6e7f72]">
              Dashboard
            </p>
            <h1 className="mt-2 text-4xl font-bold">
              Today habits
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/profile"
              className="rounded-md border border-[#cbd4cc] bg-white px-4 py-2 text-sm font-semibold text-[#3c493f] transition hover:border-[#9fab9f]"
            >
              Profile
            </Link>
            <button
              onClick={logout}
              className="w-fit rounded-md border border-[#cbd4cc] bg-white px-4 py-2 text-sm font-semibold text-[#3c493f] transition hover:border-[#9fab9f]"
            >
              Logout
            </button>
          </div>
        </header>

        <section className="mt-8 grid gap-3 sm:grid-cols-3">
          <div className="rounded-lg border border-[#dce3dc] bg-white p-4 shadow-sm">
            <p className="text-sm font-medium text-[#6e7f72]">Completed</p>
            <p className="mt-2 text-3xl font-bold">
              {completedToday}/{habits.length}
            </p>
          </div>
          <div className="rounded-lg border border-[#dce3dc] bg-white p-4 shadow-sm">
            <p className="text-sm font-medium text-[#6e7f72]">Daily score</p>
            <p className="mt-2 text-3xl font-bold">{completionPercent}%</p>
          </div>
          <div className="rounded-lg border border-[#dce3dc] bg-white p-4 shadow-sm">
            <p className="text-sm font-medium text-[#6e7f72]">Total streak</p>
            <p className="mt-2 text-3xl font-bold">{totalStreak} days</p>
          </div>
        </section>

        <section className="mt-6 rounded-lg border border-[#dce3dc] bg-white p-4 shadow-sm">
          <div className="grid gap-3 lg:grid-cols-[1fr_1.3fr_auto]">
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") addHabit();
              }}
              placeholder="New habit..."
              className="min-h-11 rounded-md border border-[#cbd4cc] bg-[#fbfcfa] px-3 text-sm outline-none transition placeholder:text-[#91a094] focus:border-[#3b8f55] focus:bg-white"
            />
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") addHabit();
              }}
              placeholder="Description or trigger..."
              className="min-h-11 rounded-md border border-[#cbd4cc] bg-[#fbfcfa] px-3 text-sm outline-none transition placeholder:text-[#91a094] focus:border-[#3b8f55] focus:bg-white"
            />
            <button
              onClick={addHabit}
              className="min-h-11 rounded-md bg-[#17201b] px-5 text-sm font-semibold text-white transition hover:bg-[#28352d]"
            >
              Add habit
            </button>
          </div>
        </section>

        <section className="mt-6 space-y-3">
          {habits.length === 0 ? (
            <div className="rounded-lg border border-dashed border-[#cbd4cc] bg-white p-8 text-center">
              <h2 className="text-xl font-semibold">No habits yet</h2>
              <p className="mt-2 text-sm text-[#6e7f72]">
                Add your first small routine and mark it done.
              </p>
            </div>
          ) : (
            habits.map((habit) => {
              const done = todayMap[habit.id];

              return (
                <article
                  key={habit.id}
                  className={`flex flex-col gap-4 rounded-lg border p-4 shadow-sm transition sm:flex-row sm:items-center sm:justify-between ${
                    done
                      ? "border-[#cde8d3] bg-[#f1fbf3]"
                      : "border-[#dce3dc] bg-white"
                  }`}
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <button
                      onClick={() => toggle(habit.id)}
                      aria-label={`Toggle ${habit.title}`}
                      className={`grid h-9 w-9 shrink-0 place-items-center rounded-md border text-xs font-bold transition ${
                        done
                          ? "border-[#3b8f55] bg-[#3b8f55] text-white"
                          : "border-[#cbd4cc] bg-white text-transparent hover:border-[#3b8f55]"
                      }`}
                    >
                      OK
                    </button>
                    <div className="min-w-0">
                      <h2
                        className={`truncate text-base font-semibold ${
                          done ? "text-[#6e7f72] line-through" : ""
                        }`}
                      >
                        {habit.title}
                      </h2>
                      <p className="text-sm text-[#6e7f72]">
                        {habit.description ||
                          (done ? "Completed today" : "Waiting for today")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-3 sm:justify-end">
                    <span className="rounded-md bg-[#eef3ef] px-3 py-2 text-sm font-semibold text-[#3c493f]">
                      {streakMap[habit.id] || 0} day streak
                    </span>
                    <Link
                      href={`/habit/${habit.id}`}
                      className="rounded-md border border-[#cbd4cc] bg-white px-3 py-2 text-sm font-semibold transition hover:border-[#9fab9f]"
                    >
                      Details
                    </Link>
                  </div>
                </article>
              );
            })
          )}
        </section>
      </div>
    </main>
  );
}
