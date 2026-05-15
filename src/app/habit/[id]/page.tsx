"use client";

import Link from "next/link";
import { useState } from "react";
import { useParams, notFound } from "next/navigation";
import { useHabit } from "@/hooks/useHabit";

import HabitHeader from "@/components/Habit/HabitHeader/HabitHeader";
import ProgressBar from "@/components/Habit/ProgressBar/ProgressBar";
import HabitEditForm from "@/components/Habit/HabitEditForm/HabitEditForm";
import HabitDangerZone from "@/components/Habit/HabitDangerZone/HabitDangerZone";
import DashboardStats from "@/components/DashboardStats/DashboardStats";
import DeleteHabitModal from "@/components/Habit/DeleteHabitModal/DeleteHabitModal";
import HabitHeatmap from "@/components/Habit/HabitHeatmap/HabitHeatmap";
import { PageLoader } from "@/components/Loader/Loader";

export default function HabitPage() {
  const params = useParams();
  const id = params.id as string;

  const {
    habit,
    loading,
    notFound: habitNotFound,
    toggle,
    save,
    remove,
    stats,
  } = useHabit(id);

  if (habitNotFound) notFound();

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const [isEditing, setIsEditing] = useState(false);

  const [editTitle, setEditTitle] = useState("");

  const [editDescription, setEditDescription] = useState("");

  const [saving, setSaving] = useState(false);

  const [deleting, setDeleting] = useState(false);

  const [toggling, setToggling] = useState(false);

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
    setDeleting(true);

    try {
      await remove();
    } catch {
      alert("Could not delete habit");
    } finally {
      setDeleting(false);
      setDeleteModalOpen(false);
    }
  }

  if (loading || !habit) {
    return <PageLoader label="Loading habit..." />;
  }

  return (
    <main className="bg-[#f6f7f4] text-[#17201b]">
      <div className="mx-auto max-w-4xl px-4 py-5 sm:px-8 sm:py-6">
        <Link
          href="/dashboard"
          className="inline-flex min-h-11 items-center rounded-md border border-[#cbd4cc] bg-white px-3 py-2 text-sm font-semibold text-[#3c493f] transition hover:border-[#9fab9f]"
        >
          Back to dashboard
        </Link>

        <section className="mt-6 rounded-lg border border-[#dce3dc] bg-white p-5 shadow-sm sm:p-7">
          {isEditing ? (
            <HabitEditForm
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
              setIsEditing={() => {
                setEditTitle(habit.title);

                setEditDescription(habit.description || "");

                setIsEditing(true);
              }}
              toggle={handleToggle}
              toggling={toggling}
            />
          )}

          <DashboardStats stats={stats} />

          <ProgressBar habit={habit} />
        </section>

        <HabitHeatmap checkinDays={habit.checkinDays} />

        <HabitDangerZone
          onDelete={() => setDeleteModalOpen(true)}
          deleting={deleting}
        />

        <DeleteHabitModal
          open={deleteModalOpen}
          title={habit.title}
          loading={deleting}
          onCancel={() => setDeleteModalOpen(false)}
          onConfirm={handleDelete}
        />
      </div>
    </main>
  );
}
