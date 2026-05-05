import { Habit } from "@/types/types";

export default function HabitProgress({ habit }: { habit: Habit }) {
  const percent = Math.min(habit.currentStreak / 30, 1) * 100;

  return (
    <div className="mt-8 ">
      <div className="mb-2 flex justify-between text-sm">
        <span>Progress over the last 30 days</span>
        <span>{habit.progressPercent}%</span>
      </div>

      <div className="h-3 rounded-full bg-[#edf0ed]">
        <div
          className="h-full rounded-full bg-[#3b8f55]"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
