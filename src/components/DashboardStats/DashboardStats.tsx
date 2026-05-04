type Stat = {
  label: string;
  value: string;
};

export default function DashboardStats({ stats }: { stats: Stat[] }) {
  return (
    <section className="grid gap-2 sm:grid-cols-3">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-lg border border-[#dce3dc] bg-white p-4 shadow-sm"
        >
          <p className="text-sm font-medium text-[#6e7f72]">{stat.label}</p>
          <p className="mt-2 text-3xl font-bold">{stat.value}</p>
        </div>
      ))}
    </section>
  );
}
