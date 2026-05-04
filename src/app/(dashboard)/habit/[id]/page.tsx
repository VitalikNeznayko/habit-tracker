"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type Habit = {
  id: string;
  title: string;
  description?: string | null;
};

export default function HabitPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [habit, setHabit] = useState<Habit | null>(null);
  const [today, setToday] = useState(false);
  const [streak, setStreak] = useState(0);
  const [longest, setLongest] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const loadData = useCallback(async (habitId: string) => {
    const res = await fetch(`/api/habits/${habitId}`);

    if (res.status === 401) {
      return { unauthorized: true as const };
    }

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

    const progressRes = await fetch(
      `/api/habits/${habitId}/progress`,
    ).then((r) => r.json());

    return {
      unauthorized: false as const,
      habit: habitData as Habit,
      today: Boolean(todayRes.completed),
      streak: Number(streakRes.streak || 0),
      longest: Number(longestRes.longestStreak || 0),
      progress: Number(progressRes.percent || 0),
    };
  }, []);

  const applyLoadedData = useCallback(
    (data: Awaited<ReturnType<typeof loadData>>) => {
    if (data.unauthorized) {
      router.replace("/login");
      return;
    }

    setHabit(data.habit);
    setEditTitle(data.habit.title);
    setEditDescription(data.habit.description || "");
    setToday(data.today);
    setStreak(data.streak);
    setLongest(data.longest);
    setProgress(data.progress);
    },
    [router],
  );

  async function refresh() {
    const data = await loadData(id);
    applyLoadedData(data);
  }

  useEffect(() => {
    if (!id) return;

    let active = true;

    loadData(id).then((data) => {
      if (!active) return;
      applyLoadedData(data);
    });

    return () => {
      active = false;
    };
  }, [applyLoadedData, id, loadData]);

  async function toggle() {
    await fetch("/api/checkins", {
      method: "POST",
      body: JSON.stringify({ habitId: id }),
      headers: { "Content-Type": "application/json" },
    });

    refresh();
  }

  async function saveHabit() {
    if (!editTitle.trim()) return;

    setSaving(true);

    const res = await fetch(`/api/habits/${id}`, {
      method: "PUT",
      body: JSON.stringify({
        title: editTitle,
        description: editDescription,
      }),
      headers: { "Content-Type": "application/json" },
    });

    setSaving(false);

    if (!res.ok) {
      const data = await res.json();
      alert(data.error || "Could not save habit");
      return;
    }

    setIsEditing(false);
    refresh();
  }

  async function deleteHabit() {
    const confirmed = window.confirm("Delete this habit and all check-ins?");

    if (!confirmed) return;

    setDeleting(true);

    const res = await fetch(`/api/habits/${id}`, {
      method: "DELETE",
    });

    setDeleting(false);

    if (!res.ok) {
      const data = await res.json();
      alert(data.error || "Could not delete habit");
      return;
    }

    router.replace("/dashboard");
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
    <main className="bg-[#f6f7f4] text-[#17201b]">
      <div className="mx-auto max-w-4xl px-5 py-6 sm:px-8">
        <Link
          href="/dashboard"
          className="inline-flex rounded-md border border-[#cbd4cc] bg-white px-3 py-2 text-sm font-semibold text-[#3c493f] transition hover:border-[#9fab9f]"
        >
          Back to dashboard
        </Link>

        <section className="mt-6 rounded-lg border border-[#dce3dc] bg-white p-5 shadow-sm sm:p-7">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold uppercase text-[#6e7f72]">
                Habit details
              </p>

              {isEditing ? (
                <div className="mt-4 space-y-3">
                  <input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full rounded-md border border-[#cbd4cc] bg-[#fbfcfa] px-3 py-3 text-base font-semibold outline-none transition focus:border-[#3b8f55] focus:bg-white"
                    placeholder="Habit title"
                  />
                  <textarea
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    className="min-h-28 w-full resize-y rounded-md border border-[#cbd4cc] bg-[#fbfcfa] px-3 py-3 text-sm leading-6 outline-none transition placeholder:text-[#91a094] focus:border-[#3b8f55] focus:bg-white"
                    placeholder="Description, trigger, or a simple note..."
                  />
                </div>
              ) : (
                <>
                  <h1 className="mt-2 text-4xl font-bold">
                    {habit.title}
                  </h1>
                  <p className="mt-3 max-w-2xl text-sm leading-6 text-[#6e7f72]">
                    {habit.description || "No description yet."}
                  </p>
                </>
              )}
            </div>

            <div className="flex flex-wrap gap-2 sm:justify-end">
              {isEditing ? (
                <>
                  <button
                    onClick={saveHabit}
                    disabled={saving}
                    className="rounded-md bg-[#17201b] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#28352d]"
                  >
                    {saving ? "Saving..." : "Save"}
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setEditTitle(habit.title);
                      setEditDescription(habit.description || "");
                    }}
                    className="rounded-md border border-[#cbd4cc] bg-white px-4 py-3 text-sm font-semibold transition hover:border-[#9fab9f]"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="rounded-md border border-[#cbd4cc] bg-white px-4 py-3 text-sm font-semibold transition hover:border-[#9fab9f]"
                >
                  Edit
                </button>
              )}

              <button
                onClick={toggle}
                className={`rounded-md px-4 py-3 text-sm font-semibold text-white transition ${
                  today
                    ? "bg-[#3b8f55] hover:bg-[#327948]"
                    : "bg-[#17201b] hover:bg-[#28352d]"
                }`}
              >
                {today ? "Completed today" : "Mark as done"}
              </button>
            </div>
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

        <section className="mt-4 rounded-lg border border-[#ead2d2] bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-semibold text-[#3f2020]">Danger zone</h2>
              <p className="mt-1 text-sm text-[#8a5f5f]">
                Deleting a habit also removes its check-in history.
              </p>
            </div>
            <button
              onClick={deleteHabit}
              disabled={deleting}
              className="rounded-md border border-[#d9a7a7] bg-[#fff8f8] px-4 py-3 text-sm font-semibold text-[#8a2f2f] transition hover:border-[#bd7676]"
            >
              {deleting ? "Deleting..." : "Delete habit"}
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
