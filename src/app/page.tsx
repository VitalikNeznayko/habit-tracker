import Link from "next/link";
import { cookies } from "next/headers";
import { getUserIdFromToken } from "@/lib/auth";
import HabitPreviewCard from "@/components/dashboard/HabitPreviewCard/HabitPreviewCard";

const previewHabits = [
  { title: "Morning walk", status: "Done", streak: "12 days" },
  { title: "Read 20 pages", status: "Done", streak: "6 days" },
  { title: "Plan tomorrow", status: "Open", streak: "3 days" },
];

const features = [
  {
    title: "Daily focus",
    copy: "Your dashboard is built around today, so the next action is always obvious.",
  },
  {
    title: "Streak memory",
    copy: "Each habit keeps current and longest streaks visible without turning progress into noise.",
  },
  {
    title: "Small edits",
    copy: "Rename a habit, add context, or remove old routines as your life changes.",
  },
];

async function Home() {
  const cookieStore = await cookies();
  const userId = getUserIdFromToken(cookieStore.get("accessToken")?.value);
  const isLoggedIn = Boolean(userId);

  return (
    <main className="bg-[#f6f7f4]">
      <section className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:px-8 lg:grid-cols-[1fr_440px] lg:items-center lg:py-20">
        <div>
          <p className="mb-4 text-sm font-semibold uppercase text-[#6e7f72]">
            Daily habit companion
          </p>
          <h1 className="max-w-3xl text-5xl font-bold leading-[1.02] text-[#121a15] sm:text-6xl">
            Habit Tracker
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-[#526056]">
            A focused place to plan routines, check off today, and keep the
            streaks that quietly move you forward.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={isLoggedIn ? "/dashboard" : "/register"}
              className="rounded-md bg-[#2f6f45] px-5 py-3 text-sm font-semibold text-white shadow-sm ring-1 ring-[#255a38] transition hover:bg-[#285f3b]"
            >
              {isLoggedIn ? "Go to dashboard" : "Create account"}
            </Link>
            {isLoggedIn ? (
              <Link
                href="/profile"
                className="rounded-md border border-[#7f9186] bg-white px-5 py-3 text-sm font-semibold text-[#17201b] shadow-sm transition hover:border-[#506258] hover:bg-[#fbfcfa]"
              >
                View profile
              </Link>
            ) : (
              <Link
                href="/login"
                className="rounded-md border border-[#7f9186] bg-white px-5 py-3 text-sm font-semibold text-[#17201b] shadow-sm transition hover:border-[#506258] hover:bg-[#fbfcfa]"
              >
                I have an account
              </Link>
            )}
          </div>
        </div>

        <HabitPreviewCard habits={previewHabits} />
      </section>

      <section className="border-y border-[#dce3dc] bg-white px-5 py-14 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase text-[#6e7f72]">
              Built for repeat days
            </p>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              Keep routines practical, visible, and easy to adjust.
            </h2>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {features.map((feature) => (
              <article
                key={feature.title}
                className="rounded-lg border border-[#dce3dc] bg-[#fbfcfa] p-5"
              >
                <h3 className="text-lg font-semibold">{feature.title}</h3>
                <p className="mt-3 text-sm leading-6 text-[#6e7f72]">
                  {feature.copy}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-8 px-5 py-14 sm:px-8 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="text-sm font-semibold uppercase text-[#6e7f72]">
            Profile and history
          </p>
          <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
            See the shape of your routine at a glance.
          </h2>
          <p className="mt-4 text-base leading-7 text-[#526056]">
            The profile view brings together your account, total habits,
            completed habits for today, and the combined streak count across
            your current routines.
          </p>
        </div>

        <div className="rounded-lg border border-[#dce3dc] bg-white p-5 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="grid h-14 w-14 place-items-center rounded-lg bg-[#17201b] text-xl font-bold text-white">
              H
            </div>
            <div>
              <p className="font-semibold">your@gmail.com</p>
              <p className="text-sm text-[#6e7f72]">Joined this month</p>
            </div>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {[
              ["Habits", "8"],
              ["Today", "5"],
              ["Longest Streak", "12"],
            ].map(([label, value]) => (
              <div
                key={label}
                className="rounded-md border border-[#eef1ee] bg-[#fbfcfa] p-3"
              >
                <p className="text-xs font-medium text-[#6e7f72]">{label}</p>
                <p className="mt-1 text-2xl font-bold">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#17201b] px-5 py-14 text-white sm:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-3xl font-bold">Start with one habit today.</h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-[#c9d6ce]">
              Small routines are easier to keep when the interface stays quiet
              and the next action is always close.
            </p>
          </div>
          <Link
            href={isLoggedIn ? "/dashboard" : "/register"}
            className="rounded-md bg-[#2f6f45] px-5 py-3 text-sm font-semibold text-white shadow-sm ring-1 ring-[#255a38] transition hover:bg-[#285f3b]"
          >
            {isLoggedIn ? "Open dashboard" : "Create account"}
          </Link>
        </div>
      </section>
    </main>
  );
}

export default Home;
