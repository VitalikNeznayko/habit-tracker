"use client";

import { useMemo, useState } from "react";
import HeatCell from "./HeatCell/HeatCell";
import MonthLabels from "./MonthLabels/MonthLabels";
import PeriodToggle from "./PeriodToggle/PeriodToggle";
import { buildGrid } from "./buildGrid";

const WEEKDAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

type Props = {
  checkinDays: string[];
};

function formatLongDate(date: Date) {
  return new Intl.DateTimeFormat("en", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export default function HabitHeatmap({ checkinDays }: Props) {
  const [periodDays, setPeriodDays] = useState(90);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  const doneSet = useMemo(() => new Set(checkinDays), [checkinDays]);

  const grid = useMemo(
    () => buildGrid(periodDays, doneSet),
    [periodDays, doneSet],
  );

  const completedCount = useMemo(
    () =>
      grid.reduce(
        (acc, week) => acc + week.filter((c) => c.completed).length,
        0,
      ),
    [grid],
  );

  const selectedCell = useMemo(() => {
    if (!selectedKey) return null;
    for (const week of grid) {
      for (const cell of week) {
        if (cell.key === selectedKey) return cell;
      }
    }
    return null;
  }, [grid, selectedKey]);

  return (
    <section className="mt-6 rounded-lg border border-[#dce3dc] bg-white p-5 shadow-sm">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase text-[#6e7f72]">
            Activity
          </p>
          <h2 className="mt-1 text-lg font-bold">Last {periodDays} days</h2>
          <p className="mt-1 text-sm text-[#6e7f72]">
            {completedCount} day{completedCount === 1 ? "" : "s"} completed
          </p>
        </div>

        <PeriodToggle
          periodDays={periodDays}
          onChange={(days) => {
            setPeriodDays(days);
            setSelectedKey(null);
          }}
        />
      </header>

      <div className="mt-5 overflow-x-auto">
        <div className="mx-auto flex w-fit flex-col gap-2">
          <MonthLabels grid={grid} />

          <div className="flex gap-1">
            <div className="flex flex-col gap-1 pr-2">
              {WEEKDAY_LABELS.map((label, i) => (
                <div
                  key={i}
                  className="h-[22px] text-[11px] leading-[22px] text-[#91a094]"
                >
                  {label}
                </div>
              ))}
            </div>

            <div className="flex gap-1 mb-2">
              {grid.map((week, wi) => (
                <div key={wi} className="flex flex-col gap-1">
                  {week.map((cell) => (
                    <HeatCell
                      key={cell.key + wi}
                      cell={cell}
                      isSelected={cell.key === selectedKey}
                      onClick={() =>
                        cell.inRange &&
                        setSelectedKey(
                          cell.key === selectedKey ? null : cell.key,
                        )
                      }
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        {selectedCell ? (
          <div className="text-sm">
            <span className="font-semibold text-[#17201b]">
              {formatLongDate(selectedCell.date)}
            </span>
            <span className="ml-2 text-[#6e7f72]">
              {selectedCell.completed ? "Completed ✓" : "Not completed"}
            </span>
          </div>
        ) : (
          <p className="text-sm text-[#91a094]">
            Click a day to see details.
          </p>
        )}

        <div className="flex items-center gap-2 text-xs text-[#6e7f72]">
          <span>Less</span>
          <span className="h-[14px] w-[14px] rounded-sm bg-[#dce6dc] ring-1 ring-[#a5b5a8]" />
          <span className="h-[14px] w-[14px] rounded-sm bg-[#3b8f55] ring-1 ring-[#2f6f45]" />
          <span>More</span>
        </div>
      </div>
    </section>
  );
}
