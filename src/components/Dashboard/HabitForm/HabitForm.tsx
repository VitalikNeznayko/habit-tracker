"use client";

import { useState } from "react";
import { createHabitSchema } from "@/lib/validators";

type HabitFormProps = {
  onSubmit: (title: string, description: string) => void;
};

export default function HabitForm({ onSubmit }: HabitFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  function handleSubmit() {
    setError("");

    const result = createHabitSchema.safeParse({
      title,
      description,
    });

    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }

    onSubmit(result.data.title, result.data.description || "");

    setTitle("");
    setDescription("");
  }

  return (
    <section className="mt-6 rounded-lg border border-[#dce3dc] bg-white p-4 shadow-sm">
      <div className="grid gap-3 lg:grid-cols-[1fr_1.3fr_auto]">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSubmit();
          }}
          placeholder="New habit..."
          className="min-h-11 rounded-md border border-[#cbd4cc] bg-[#fbfcfa] px-3 text-sm outline-none transition placeholder:text-[#91a094] focus:border-[#3b8f55] focus:bg-white"
        />

        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSubmit();
          }}
          placeholder="Description or trigger..."
          className="min-h-11 rounded-md border border-[#cbd4cc] bg-[#fbfcfa] px-3 text-sm outline-none transition placeholder:text-[#91a094] focus:border-[#3b8f55] focus:bg-white"
        />

        <button
          onClick={handleSubmit}
          className="min-h-11 rounded-md bg-[#17201b] px-5 text-sm font-semibold text-white transition hover:bg-[#28352d]"
        >
          Add habit
        </button>
      </div>

      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
    </section>
  );
}
