import type { Cell } from "@/types/types";

type Props = {
  cell: Cell;
  isSelected: boolean;
  onClick: () => void;
};

export default function HeatCell({ cell, isSelected, onClick }: Props) {
  if (!cell.inRange) {
    return <div aria-hidden className="h-[22px] w-[22px]" />;
  }

  const base = cell.completed
    ? "bg-[#3b8f55] hover:bg-[#327948]"
    : "bg-[#dce6dc] hover:bg-[#c1cfc4]";

  let ring = "ring-1 ring-[#a5b5a8]";
  if (cell.completed) ring = "ring-1 ring-[#2f6f45]";
  if (cell.isToday) ring = "ring-2 ring-[#17201b]";
  if (isSelected) ring = "ring-2 ring-[#3b8f55]";

  return (
    <button
      onClick={onClick}
      title={`${cell.key} — ${cell.completed ? "Completed" : "Not completed"}`}
      className={`h-[22px] w-[22px] rounded-sm transition ${base} ${ring}`}
      aria-label={`${cell.key}: ${cell.completed ? "completed" : "not completed"}`}
    />
  );
}
