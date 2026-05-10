import type { Cell } from "@/types/types";

const MONTH_LABELS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

type Props = {
  grid: Cell[][];
};

export default function MonthLabels({ grid }: Props) {
  const labels: { week: number; month: string }[] = [];
  let lastMonth = -1;

  grid.forEach((week, wi) => {
    const firstInRange = week.find((c) => c.inRange);
    if (!firstInRange) return;
    const month = firstInRange.date.getMonth();
    if (month !== lastMonth) {
      labels.push({ week: wi, month: MONTH_LABELS[month] });
      lastMonth = month;
    }
  });

  return (
    <div className="ml-[34px] flex h-3 gap-1">
      {grid.map((_, wi) => {
        const label = labels.find((l) => l.week === wi);
        return (
          <div
            key={wi}
            className="w-[22px] text-[10px] leading-3 text-[#91a094]"
          >
            {label?.month ?? ""}
          </div>
        );
      })}
    </div>
  );
}
