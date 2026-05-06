"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useHabit } from "@/hooks/useHabit";

import HabitHeader from "@/components/Habit/HabitHeader/HabitHeader";
import ProgressBar from "@/components/Habit/ProgressBar/ProgressBar";
import HabitEditForm from "@/components/Habit/HabitEditForm/HabitEditForm";
import HabitDangerZone from "@/components/Habit/HabitDangerZone/HabitDangerZone";
import DashboardStats from "@/components/DashboardStats/DashboardStats";

export default function HabitPage() {
  const params = useParams();
  const id = params.id as string;

  const { habit, loading, toggle, save, remove, stats } = useHabit(id);

  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [toggling, setToggling] = useState(false);

  useEffect(() => {
    if (!habit) return;
    setEditTitle(habit.title);
    setEditDescription(habit.description || "");
  }, [habit]);

  async function handleSave() {
    if (!editTitle.trim()) return;

    setSaving(true);
    try {
      await save(editTitle, editDescription);
      setIsEditing(false);
    } catch {
      alert("Could not save habit");
    } finally {
      setSaving(false);
    }
  }

  async function handleToggle() {
    setToggling(true);
    try {
      await Promise.resolve(toggle());
    } finally {
      setToggling(false);
    }
  }

  async function handleDelete() {
    const confirmed = window.confirm("Delete this habit and all check-ins?");
    if (!confirmed) return;

    setDeleting(true);
    try {
      await remove();
    } catch {
      alert("Could not delete habit");
    } finally {
      setDeleting(false);
    }
  }

  if (loading || !habit) {
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
          {isEditing ? (
            <HabitEditForm
              habit={habit}
              editTitle={editTitle}
              editDescription={editDescription}
              setEditTitle={setEditTitle}
              setEditDescription={setEditDescription}
              onSave={handleSave}
              onCancel={() => {
                setIsEditing(false);
                setEditTitle(habit.title);
                setEditDescription(habit.description || "");
              }}
              saving={saving}
            />
          ) : (
            <HabitHeader
              habit={habit}
              setIsEditing={setIsEditing}
              toggle={handleToggle}
              toggling={toggling}
            />
          )}

          <DashboardStats stats={stats} />
          <ProgressBar habit={habit} />
        </section>

        <HabitDangerZone onDelete={handleDelete} deleting={deleting} />
      </div>
    </main>
  );
}
