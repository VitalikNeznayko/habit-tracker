import Link from "next/link";
import DashboardStats from "@/components/DashboardStats/DashboardStats";

type PreviewHabit = {
  title: string;
  status: string;
  streak: string;
};

export default function HabitPreviewCard({
  habits,
}: {
  habits: PreviewHabit[];
}) {
  return (
    <div className="rounded-lg border border-[#dce3dc] bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold uppercase text-[#6e7f72]">
            Dashboard
          </p>
          <p className="mt-1 text-lg font-bold text-[#17201b]">Today habits</p>
        </div>
        <div className="rounded-md bg-[#eaf4ec] px-3 py-2 text-sm font-semibold text-[#2f6f45]">
          66%
        </div>
      </div>

      <DashboardStats
        stats={[
          { label: "Completed", value: "2/3" },
          { label: "Daily score", value: "66%" },
          { label: "Longest streak", value: "12" },
        ]}
      />

      <div className="mt-4 space-y-3">
        {habits.map((habit, index) => (
          <div
            key={habit.title}
            className="flex items-center justify-between rounded-md border border-[#eef1ee] bg-[#fbfcfa] p-3"
          >
            <div className="flex min-w-0 items-center gap-3">
              <span
                className={`grid h-6 w-6 shrink-0 place-items-center rounded-md border text-[10px] font-bold ${
                  index < 2
                    ? "border-[#3b8f55] bg-[#3b8f55] text-white"
                    : "border-[#cbd4cc] bg-white text-transparent"
                }`}
              >
                ✓
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-[#253029]">
                  {habit.title}
                </p>
                <p className="text-xs text-[#6e7f72]">Streak: {habit.streak}</p>
              </div>
            </div>
            <span className="text-xs font-semibold text-[#6e7f72]">
              {habit.status}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-5 h-2 overflow-hidden rounded-full bg-[#edf0ed]">
        <div className="h-full w-1/2 rounded-full bg-[#3b8f55]" />
      </div>
      <Link
        href="/dashboard"
        className="mt-5 flex min-h-11 items-center justify-center rounded-md border border-[#cbd4cc] bg-white px-4 text-sm font-semibold text-[#17201b] transition hover:border-[#9fab9f]"
      >
        Open dashboard
      </Link>
    </div>
  );
}
