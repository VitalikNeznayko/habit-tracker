"use client";

import { useState } from "react";
import { Habit } from "@/types/types";
import { updateHabitSchema } from "@/lib/validators";

type Props = {
  editTitle: string;
  editDescription: string;
  setEditTitle: (v: string) => void;
  setEditDescription: (v: string) => void;
  onSave: () => void;
  onCancel: () => void;
  saving: boolean;
};

export default function HabitEditForm({
  editTitle,
  editDescription,
  setEditTitle,
  setEditDescription,
  onSave,
  onCancel,
  saving,
}: Props) {
  const [error, setError] = useState("");

  function handleSave() {
    setError("");

    const result = updateHabitSchema.safeParse({
      title: editTitle,
      description: editDescription,
    });

    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }

    onSave();
  }

  return (
    <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold uppercase text-[#6e7f72]">
          Habit details
        </p>

        <div className="mt-4 space-y-3">
          {error && <p className="text-sm text-red-600">{error}</p>}
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
      </div>

      <div className="ml-5 flex flex-wrap gap-2 sm:justify-end">
        <>
          <button
            onClick={handleSave}
            disabled={saving}
            className="rounded-md bg-[#17201b] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#28352d] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save"}
          </button>

          <button
            onClick={onCancel}
            className="rounded-md border border-[#cbd4cc] bg-white px-4 py-3 text-sm font-semibold transition hover:border-[#9fab9f]"
          >
            Cancel
          </button>
        </>
      </div>
    </div>
  );
}
