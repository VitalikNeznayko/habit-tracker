import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Habits } from "@/types/types";

export function useHabits() {
  const router = useRouter();
  const [habits, setHabits] = useState<Habits[]>([]);

  const load = useCallback(async () => {
    const res = await fetch("/api/habits", {
      credentials: "include",
    });

    if (res.status === 401) {
      router.replace("/login");
      return;
    }

    const data = await res.json();
    setHabits(data);
  }, []);
  
  useEffect(() => {
    void load();
  }, []);

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
      body: JSON.stringify({ title, description }),
      headers: { "Content-Type": "application/json" },
    });

    load();
  }

  return {
    habits,
    toggle,
    addHabit,
  };
}
