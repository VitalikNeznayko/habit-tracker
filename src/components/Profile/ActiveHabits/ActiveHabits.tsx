import Link from "next/link";

type Habit = {
  id: string;
  title: string;
  description?: string | null;
};

type Props = {
  habits: Habit[];
};

export default function ActiveHabits({ habits }: Props) {
  return (
    <section className="mt-6 rounded-lg border border-[#dce3dc] bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold">Active habits</h2>

          <p className="mt-1 text-sm text-[#6e7f72]">
            A quick list of what currently shapes your routine.
          </p>
        </div>

        <Link
          href="/dashboard"
          className="inline-flex min-h-11 items-center justify-center self-start rounded-md bg-[#17201b] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#28352d]"
        >
          Manage
        </Link>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        {habits.length === 0 ? (
          <p className="rounded-md border border-dashed border-[#cbd4cc] p-4 text-sm text-[#6e7f72] md:col-span-2">
            No habits yet. Create one from the dashboard.
          </p>
        ) : (
          habits.map((habit) => (
            <Link
              key={habit.id}
              href={`/habit/${habit.id}`}
              className="rounded-md border border-[#eef1ee] bg-[#fbfcfa] p-4 transition hover:border-[#cbd4cc] hover:bg-white"
            >
              <h3 className="font-semibold">{habit.title}</h3>

              <p className="mt-1 text-sm leading-5 text-[#6e7f72]">
                {habit.description || "No description yet."}
              </p>
            </Link>
          ))
        )}
      </div>
    </section>
  );
}
