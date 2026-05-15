import DashboardStats from "@/components/DashboardStats/DashboardStats";

type Props = {
  habitsCount: number;
  completedToday: number;
  longestStreak: number;
  completionPercent: number;
};

export default function ProfileOverview({
  habitsCount,
  completedToday,
  longestStreak,
  completionPercent,
}: Props) {
  return (
    <>
      <DashboardStats
        stats={[
          {
            label: "Habits",
            value: String(habitsCount),
          },
          {
            label: "Completed today",
            value: String(completedToday),
          },
          {
            label: "Longest streak",
            value: String(longestStreak),
          },
        ]}
      />

      <div className="min-w-0 rounded-lg border border-[#dce3dc] bg-white p-5 shadow-sm sm:col-span-3">
        <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
          <span className="font-semibold text-[#3c493f]">Daily completion</span>

          <span className="text-[#6e7f72]">{completionPercent}%</span>
        </div>

        <div className="mt-3 h-3 overflow-hidden rounded-full bg-[#edf0ed]">
          <div
            className="h-full rounded-full bg-[#3b8f55]"
            style={{
              width: `${completionPercent}%`,
            }}
          />
        </div>
      </div>
    </>
  );
}
