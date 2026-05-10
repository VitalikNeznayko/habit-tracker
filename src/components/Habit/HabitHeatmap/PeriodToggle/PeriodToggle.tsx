const PERIOD_OPTIONS = [
  { label: "30d", days: 30 },
  { label: "90d", days: 90 },
];

type Props = {
  periodDays: number;
  onChange: (days: number) => void;
};

export default function PeriodToggle({ periodDays, onChange }: Props) {
  return (
    <div className="flex flex-wrap gap-1 rounded-md border border-[#dce3dc] bg-[#fbfcfa] p-1">
      {PERIOD_OPTIONS.map((opt) => (
        <button
          key={opt.days}
          onClick={() => onChange(opt.days)}
          className={`rounded px-3 py-1 text-xs font-semibold transition ${
            periodDays === opt.days
              ? "bg-[#17201b] text-white"
              : "text-[#3c493f] hover:bg-white"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
