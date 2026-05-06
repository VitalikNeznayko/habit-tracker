import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Habit } from "@/types/types";

export function useHabit(id: string) {
  const [toggling, setToggling] = useState(false);
  const router = useRouter();
  const [habit, setHabit] = useState<Habit | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const res = await fetch(`/api/habits/${id}`);

    if (res.status === 401) {
      router.replace("/login");
      return;
    }

    const data = await res.json();
    setHabit(data);
    setLoading(false);
  }, [id, router]);
  
  useEffect(() => {
    if (!id) return;

    void load();
  }, [id]);

  async function toggle() {
    if (toggling) return;
    setToggling(true);

    try {
      const res = await fetch("/api/checkins", {
        method: "POST",
        body: JSON.stringify({ habitId: id }),
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) throw new Error();

      await load();
    } finally {
      setToggling(false);
    }
  }

  async function save(title: string, description: string) {
    const res = await fetch(`/api/habits/${id}`, {
      method: "PUT",
      body: JSON.stringify({ title, description }),
      headers: { "Content-Type": "application/json" },
    });

    if (!res.ok) throw new Error();

    await load();
  }

  async function remove() {
    const res = await fetch(`/api/habits/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) throw new Error();

    router.replace("/dashboard");
  }

  const stats = habit
    ? [
        {
          id: "current",
          label: "Current streak",
          value: `${habit.currentStreak} days`,
        },
        {
          id: "longest",
          label: "Longest streak",
          value: `${habit.longestStreak} days`,
        },
        {
          id: "progress",
          label: "30-day progress",
          value: `${habit.progressPercent}%`,
        },
      ]
    : [];

  return {
    habit,
    loading,
    toggle,
    save,
    remove,
    stats,
  };
}
