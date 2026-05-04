"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type UserProfile = {
  id: string;
  email: string;
  createdAt: string;
};

type Habit = {
  id: string;
  title: string;
  description?: string | null;
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
    const userRes = await fetch("/api/auth/me");

    if (userRes.status === 401) {
      return { unauthorized: true as const };
    }

    const user = (await userRes.json()) as UserProfile;
    const habits = (await fetch("/api/habits").then((r) => r.json())) as Habit[];

    let completedToday = 0;
    let totalStreak = 0;

    await Promise.all(
      habits.map(async (habit) => {
        const today = await fetch(`/api/habits/${habit.id}/today`).then((r) =>
          r.json(),
        );
        const streak = await fetch(`/api/habits/${habit.id}/streak`).then((r) =>
          r.json(),
        );

        if (today.completed) completedToday += 1;
        totalStreak += Number(streak.streak || 0);
      }),
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

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/login");
  }

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

  return (
    <main className="min-h-screen bg-[#f6f7f4] px-5 py-6 text-[#17201b] sm:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase text-[#6e7f72]">
              Profile
            </p>
            <h1 className="mt-2 text-4xl font-bold">
              Your habit space
            </h1>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/dashboard"
              className="rounded-md border border-[#cbd4cc] bg-white px-4 py-2 text-sm font-semibold text-[#3c493f] transition hover:border-[#9fab9f]"
            >
              Dashboard
            </Link>
            <button
              onClick={logout}
              className="rounded-md border border-[#cbd4cc] bg-white px-4 py-2 text-sm font-semibold text-[#3c493f] transition hover:border-[#9fab9f]"
            >
              Logout
            </button>
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
            <p className="mt-5 rounded-md bg-[#fbfcfa] px-3 py-3 text-xs text-[#6e7f72]">
              User ID: {profile.user.id}
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg border border-[#dce3dc] bg-white p-5 shadow-sm">
              <p className="text-sm font-medium text-[#6e7f72]">Habits</p>
              <p className="mt-2 text-4xl font-bold">{profile.habits.length}</p>
            </div>
            <div className="rounded-lg border border-[#dce3dc] bg-white p-5 shadow-sm">
              <p className="text-sm font-medium text-[#6e7f72]">
                Completed today
              </p>
              <p className="mt-2 text-4xl font-bold">
                {profile.completedToday}
              </p>
            </div>
            <div className="rounded-lg border border-[#dce3dc] bg-white p-5 shadow-sm">
              <p className="text-sm font-medium text-[#6e7f72]">
                Total streak
              </p>
              <p className="mt-2 text-4xl font-bold">{profile.totalStreak}</p>
            </div>
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
