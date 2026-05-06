"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import DashboardStats from "@/components/DashboardStats/DashboardStats";

type UserProfile = {
  id: string;
  email: string;
  createdAt: string;
};

type Habit = {
  id: string;
  title: string;
  description?: string | null;
  todayCompleted: boolean;
  currentStreak: number;
};

type ProfileData = {
  user: UserProfile;
  habits: Habit[];
  completedToday: number;
  totalStreak: number;
};

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileData | null>(null);

  async function loadProfile() {
    const [userRes, habitsRes] = await Promise.all([
      fetch("/api/auth/user", { credentials: "include" }),
      fetch("/api/habits", { credentials: "include" }),
    ]);

    if (userRes.status === 401 || habitsRes.status === 401) {
      return { unauthorized: true as const };
    }

    const user = (await userRes.json()) as UserProfile;
    const habits = (await habitsRes.json()) as Habit[];
    const completedToday = habits.filter(
      (habit) => habit.todayCompleted,
    ).length;
    const totalStreak = habits.reduce(
      (sum, habit) => sum + Number(habit.currentStreak || 0),
      0,
    );

    return {
      unauthorized: false as const,
      user,
      habits,
      completedToday,
      totalStreak,
    };
  }

  useEffect(() => {
    let active = true;

    loadProfile().then((data) => {
      if (!active) return;

      if (data.unauthorized) {
        router.replace("/login");
        return;
      }

      setProfile({
        user: data.user,
        habits: data.habits,
        completedToday: data.completedToday,
        totalStreak: data.totalStreak,
      });
    });

    return () => {
      active = false;
    };
  }, [router]);

  if (!profile) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#f6f7f4] px-5 text-[#17201b]">
        <div className="rounded-lg border border-[#dce3dc] bg-white px-5 py-4 text-sm font-semibold shadow-sm">
          Loading profile...
        </div>
      </main>
    );
  }

  const joinedAt = new Intl.DateTimeFormat("en", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(profile.user.createdAt));
  const completionPercent = profile.habits.length
    ? Math.round((profile.completedToday / profile.habits.length) * 100)
    : 0;

  const longestStreak = profile.habits.reduce(
    (max, h) => Math.max(max, h.currentStreak || 0),
    0,
  );
  return (
    <main className="bg-[#f6f7f4] text-[#17201b]">
      <div className="mx-auto max-w-6xl px-5 py-6 sm:px-8">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase text-[#6e7f72]">
              Profile
            </p>
            <h1 className="mt-2 text-4xl font-bold">Your habit space</h1>
          </div>
        </header>

        <section className="mt-8 grid gap-4 lg:grid-cols-[360px_1fr]">
          <div className="rounded-lg border border-[#dce3dc] bg-white p-5 shadow-sm">
            <div className="grid h-16 w-16 place-items-center rounded-lg bg-[#17201b] text-2xl font-bold text-white">
              {profile.user.email.slice(0, 1).toUpperCase()}
            </div>
            <h2 className="mt-5 break-words text-2xl font-bold">
              {profile.user.email}
            </h2>
            <p className="mt-2 text-sm text-[#6e7f72]">Joined {joinedAt}</p>
          </div>

          <div className="space-y-3">
            <DashboardStats
              stats={[
                { label: "Habits", value: String(profile.habits.length) },
                {
                  label: "Completed today",
                  value: String(profile.completedToday),
                },
                {
                  label: "Longest streak",
                  value: String(longestStreak),
                },
              ]}
            />
            <div className="rounded-lg border border-[#dce3dc] bg-white p-5 shadow-sm sm:col-span-3">
              <div className="flex items-center justify-between text-sm">
                <span className="font-semibold text-[#3c493f]">
                  Daily completion
                </span>
                <span className="text-[#6e7f72]">{completionPercent}%</span>
              </div>
              <div className="mt-3 h-3 overflow-hidden rounded-full bg-[#edf0ed]">
                <div
                  className="h-full rounded-full bg-[#3b8f55]"
                  style={{ width: `${completionPercent}%` }}
                />
              </div>
            </div>
          </div>
        </section>

        <section className="mt-6 rounded-lg border border-[#dce3dc] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold">Active habits</h2>
              <p className="mt-1 text-sm text-[#6e7f72]">
                A quick list of what currently shapes your routine.
              </p>
            </div>
            <Link
              href="/dashboard"
              className="rounded-md bg-[#17201b] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#28352d]"
            >
              Manage
            </Link>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {profile.habits.length === 0 ? (
              <p className="rounded-md border border-dashed border-[#cbd4cc] p-4 text-sm text-[#6e7f72] md:col-span-2">
                No habits yet. Create one from the dashboard.
              </p>
            ) : (
              profile.habits.map((habit) => (
                <Link
                  key={habit.id}
                  href={`/habit/${habit.id}`}
                  className="rounded-md border border-[#eef1ee] bg-[#fbfcfa] p-4 transition hover:border-[#cbd4cc] hover:bg-white"
                >
                  <h3 className="font-semibold">{habit.title}</h3>
                  <p className="mt-1 text-sm text-[#6e7f72]">
                    {habit.description || "No description yet."}
                  </p>
                </Link>
              ))
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
