"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import ProfileCard from "@/components/Profile/ProfileCard/ProfileCard";
import ProfileOverview from "@/components/Profile/ProfileOverview/ProfileOverview";
import ChangePasswordForm from "@/components/Profile/ChangePasswordForm/ChangePasswordForm";
import ActiveHabits from "@/components/Profile/ActiveHabits/ActiveHabits";

type UserProfile = {
  id: string;
  email: string;
  createdAt: string;
  hasPassword: boolean;
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

  const [mode, setMode] = useState<"overview" | "password">("overview");

  const [currentPassword, setCurrentPassword] = useState("");

  const [newPassword, setNewPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");

  const [passwordError, setPasswordError] = useState("");

  const [passwordLoading, setPasswordLoading] = useState(false);

  async function loadProfile() {
    const [userRes, habitsRes] = await Promise.all([
      fetch("/api/auth/user", {
        credentials: "include",
      }),

      fetch("/api/habits", {
        credentials: "include",
      }),
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

  async function handlePasswordChange() {
    if (passwordLoading) return;

    setPasswordError("");
    setPasswordLoading(true);

    try {
      const res = await fetch("/api/users", {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
          confirmPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setPasswordError(data.error || "Something went wrong");
        return;
      }

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setMode("overview");
    } catch {
      setPasswordError("Server error");
    } finally {
      setPasswordLoading(false);
    }
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
          <ProfileCard
            email={profile.user.email}
            joinedAt={joinedAt}
            hasPassword={profile.user.hasPassword}
            onChangePassword={() => setMode("password")}
          />
          <div className="space-y-3">
            {mode === "overview" ? (
              <ProfileOverview
                habitsCount={profile.habits.length}
                completedToday={profile.completedToday}
                longestStreak={longestStreak}
                completionPercent={completionPercent}
              />
            ) : (
              <ChangePasswordForm
                currentPassword={currentPassword}
                newPassword={newPassword}
                confirmPassword={confirmPassword}
                passwordError={passwordError}
                passwordLoading={passwordLoading}
                setCurrentPassword={setCurrentPassword}
                setNewPassword={setNewPassword}
                setConfirmPassword={setConfirmPassword}
                onSubmit={handlePasswordChange}
                onBack={() => setMode("overview")}
              />
            )}
          </div>
        </section>

        <ActiveHabits habits={profile.habits} />
      </div>
    </main>
  );
}
