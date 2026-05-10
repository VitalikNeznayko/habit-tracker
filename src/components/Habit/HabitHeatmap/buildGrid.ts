import { formatDayKey, getToday } from "@/lib/date";
import type { Cell } from "@/types/types";

export function buildGrid(
  periodDays: number,
  doneSet: Set<string>,
): Cell[][] {
  const today = getToday();
  const todayKey = formatDayKey(today);

  const rangeStart = new Date(today);
  rangeStart.setDate(today.getDate() - (periodDays - 1));

  const startDow = rangeStart.getDay();
  const padDays = startDow === 0 ? 6 : startDow - 1;

  const gridStart = new Date(rangeStart);
  gridStart.setDate(rangeStart.getDate() - padDays);

  const totalCells =
    Math.round((today.getTime() - gridStart.getTime()) / 86_400_000) + 1;
  const totalWeeks = Math.ceil(totalCells / 7);

  const weeks: Cell[][] = [];

  for (let w = 0; w < totalWeeks; w++) {
    const days: Cell[] = [];

    for (let d = 0; d < 7; d++) {
      const date = new Date(gridStart);
      date.setDate(gridStart.getDate() + w * 7 + d);

      const inRange = date >= rangeStart && date <= today;
      const key = formatDayKey(date);

      days.push({
        date,
        key,
        inRange,
        isToday: key === todayKey,
        completed: inRange && doneSet.has(key),
      });
    }

    weeks.push(days);
  }

  return weeks;
}
