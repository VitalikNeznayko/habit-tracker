"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import DashboardStats from "@/components/DashboardStats/DashboardStats";
import HabitCard from "@/components/HabitCard/HabitCard";
import HabitForm from "@/components/HabitForm/HabitForm";

type Habit = {
  id: string;
  title: string;
  description?: string | null;
  todayCompleted: boolean;
  currentStreak: number;
};

export default function Dashboard() {
  const router = useRouter();
  const [habits, setHabits] = useState<Habit[]>([]);

  async function loadData() {
    const res = await fetch("/api/habits", {
      credentials: "include",
    });

    if (res.status === 401) {
      return { unauthorized: true as const };
    }

    const data = (await res.json()) as Habit[];

    return {
      unauthorized: false as const,
      habits: data,
    };
  }

  async function refresh() {
    const data = await loadData();

    if (data.unauthorized) {
      router.replace("/login");
      return;
    }

    setHabits(data.habits);
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
    });

    return () => {
      active = false;
    };
  }, [router]);

  async function toggle(id: string) {
    setHabits((prev) =>
      prev.map((h) =>
        h.id === id
          ? {
              ...h,
              todayCompleted: !h.todayCompleted,
              currentStreak: h.todayCompleted
                ? Math.max(0, h.currentStreak - 1)
                : h.currentStreak + 1,
            }
          : h,
      ),
    );

    try {
      const res = await fetch("/api/checkins", {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({ habitId: id }),
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) throw new Error();
    } catch {
      setHabits((prev) =>
        prev.map((h) =>
          h.id === id
            ? {
                ...h,
                todayCompleted: !h.todayCompleted,
                currentStreak: h.todayCompleted
                  ? h.currentStreak + 1
                  : Math.max(0, h.currentStreak - 1),
              }
            : h,
        ),
      );
    }
  }

  async function addHabit(title: string, description: string) {
    await fetch("/api/habits", {
      method: "POST",
      credentials: "include",
      body: JSON.stringify({ title, description }),
      headers: { "Content-Type": "application/json" },
    });

    refresh();
  }

  const completedToday = habits.filter((habit) => habit.todayCompleted).length;
  const longestStreak = habits.reduce(
    (max, habit) => Math.max(max, habit.currentStreak || 0),
    0,
  );
  const completionPercent = habits.length
    ? Math.round((completedToday / habits.length) * 100)
    : 0;

  return (
    <main className="bg-[#f6f7f4] text-[#17201b]">
      <div className="mx-auto max-w-6xl px-5 py-6 sm:px-8">
        <div className="gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-semibold uppercase text-[#6e7f72]">
            Dashboard
          </p>
          <h1 className="mt-2 text-4xl font-bold">Today habits</h1>
        </div>

        <div className="mt-8">
          <DashboardStats
            stats={[
              {
                label: "Completed",
                value: `${completedToday}/${habits.length}`,
              },
              { label: "Daily score", value: `${completionPercent}%` },
              { label: "Longest streak", value: `${longestStreak} days` },
            ]}
          />
        </div>

        <HabitForm onSubmit={addHabit} />

        <section className="mt-6 space-y-3">
          {habits.length === 0 ? (
            <div className="rounded-lg border border-dashed border-[#cbd4cc] bg-white p-8 text-center">
              <h2 className="text-xl font-semibold">No habits yet</h2>
              <p className="mt-2 text-sm text-[#6e7f72]">
                Add your first small routine and mark it done.
              </p>
            </div>
          ) : (
            habits.map((habit) => (
              <HabitCard
                key={habit.id}
                id={habit.id}
                title={habit.title}
                description={habit.description}
                todayCompleted={habit.todayCompleted}
                currentStreak={habit.currentStreak}
                onToggle={toggle}
              />
            ))
          )}
        </section>
      </div>
    </main>
  );
}
