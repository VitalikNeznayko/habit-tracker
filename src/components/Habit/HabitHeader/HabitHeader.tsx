import { Habit } from "@/types/types";

type Props = {
  habit: Habit;
  setIsEditing: (v: boolean) => void;
  toggle: () => void;
  toggling?: boolean;
};

export default function HabitHeader({
  habit,
  setIsEditing,
  toggle,
  toggling = false,
}: Props) {
  return (
    <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold uppercase text-[#6e7f72]">
          Habit details
        </p>

        <>
          <h1 className="mt-2 text-4xl font-bold">{habit.title}</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-[#6e7f72]">
            {habit.description || "No description yet."}
          </p>
        </>
      </div>

      <div className="flex flex-wrap gap-2 sm:justify-end">
        <button
          onClick={() => setIsEditing(true)}
          className="rounded-md border border-[#cbd4cc] bg-white px-4 py-3 text-sm font-semibold transition hover:border-[#9fab9f]"
        >
          Edit
        </button>

        <button
          onClick={toggle}
          disabled={toggling}
          className={`rounded-md px-4 py-3 text-sm font-semibold text-white transition ${
            toggling ? "opacity-50 cursor-not-allowed" : ""
          } ${
            habit.todayCompleted
              ? "bg-[#3b8f55] hover:bg-[#327948]"
              : "bg-[#17201b] hover:bg-[#28352d]"
          }`}
        >
          {toggling
            ? "Loading..."
            : habit.todayCompleted
              ? "Completed today"
              : "Mark as done"}
        </button>
      </div>
    </div>
  );
}
