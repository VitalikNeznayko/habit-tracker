"use client";
import DashboardStats from "@/components/DashboardStats/DashboardStats";
import HabitCard from "@/components/Dashboard/HabitCard/HabitCard";
import HabitForm from "@/components/Dashboard/HabitForm/HabitForm";
import { useHabits } from "@/hooks/useHabits";

export default function Dashboard() {
  const { habits, toggle, addHabit } = useHabits();

  const completedToday = habits.filter((h) => h.todayCompleted).length;

  const longestStreak = habits.reduce(
    (max, h) => Math.max(max, h.currentStreak || 0),
    0,
  );

  const completionPercent = habits.length
    ? Math.round((completedToday / habits.length) * 100)
    : 0;

  return (
    <main className="bg-[#f6f7f4] text-[#17201b]">
      <div className="mx-auto max-w-6xl px-4 py-5 sm:px-8 sm:py-6">
        <div className="gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-semibold uppercase text-[#6e7f72]">
            Dashboard
          </p>
          <h1 className="mt-2 text-3xl font-bold leading-tight sm:text-4xl">
            Today habits
          </h1>
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
