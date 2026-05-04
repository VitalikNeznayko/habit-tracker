import Link from "next/link";

const previewHabits = [
  { title: "Morning walk", status: "Done", streak: "12 days" },
  { title: "Read 20 pages", status: "Done", streak: "6 days" },
  { title: "Plan tomorrow", status: "Open", streak: "3 days" },
  { title: "No phone at lunch", status: "Open", streak: "9 days" },
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

function Home() {
  return (
    <main className="min-h-screen bg-[#f6f7f4]">
      <header className="border-b border-[#dce3dc] bg-[#f6f7f4]/95 px-5 py-4 sm:px-8">
        <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <Link href="/" className="text-lg font-semibold">
            Habit Tracker
          </Link>
          <div className="flex items-center gap-2">
            <Link
              href="#features"
              className="hidden rounded-md px-4 py-2 text-sm font-medium text-[#526056] transition hover:bg-white hover:text-[#17201b] sm:inline-flex"
            >
              Features
            </Link>
            <Link
              href="/login"
              className="rounded-md px-4 py-2 text-sm font-semibold text-[#435248] transition hover:bg-white hover:text-[#17201b]"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="rounded-md bg-[#2f6f45] px-4 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-[#255a38] transition hover:bg-[#285f3b]"
            >
              Start
            </Link>
          </div>
        </nav>
      </header>

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
              href="/register"
              className="rounded-md bg-[#2f6f45] px-5 py-3 text-sm font-semibold text-white shadow-sm ring-1 ring-[#255a38] transition hover:bg-[#285f3b]"
            >
              Create account
            </Link>
            <Link
              href="/login"
              className="rounded-md border border-[#7f9186] bg-white px-5 py-3 text-sm font-semibold text-[#17201b] shadow-sm transition hover:border-[#506258] hover:bg-[#fbfcfa]"
            >
              I have an account
            </Link>
          </div>
        </div>

        <div className="rounded-lg border border-[#dce3dc] bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-[#17201b]">Today</p>
              <p className="text-xs text-[#6e7f72]">2 of 4 completed</p>
            </div>
            <div className="rounded-md bg-[#eaf4ec] px-3 py-2 text-sm font-semibold text-[#2f6f45]">
              50%
            </div>
          </div>
          <div className="space-y-3">
            {previewHabits.map((habit, index) => (
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
                    OK
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-[#253029]">
                      {habit.title}
                    </p>
                    <p className="text-xs text-[#6e7f72]">{habit.streak}</p>
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
        </div>
      </section>

      <section
        id="features"
        className="border-y border-[#dce3dc] bg-white px-5 py-14 sm:px-8"
      >
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
              ["Streak", "41"],
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
            href="/register"
            className="rounded-md bg-[#2f6f45] px-5 py-3 text-sm font-semibold text-white shadow-sm ring-1 ring-[#255a38] transition hover:bg-[#285f3b]"
          >
            Create account
          </Link>
        </div>
      </section>

      <footer className="border-t border-[#dce3dc] bg-[#f6f7f4] px-5 py-8 sm:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 text-sm text-[#6e7f72] sm:flex-row sm:items-center sm:justify-between">
          <p className="font-semibold text-[#17201b]">Habit Tracker</p>
          <div className="flex flex-wrap gap-4">
            <Link href="/login" className="hover:text-[#17201b]">
              Login
            </Link>
            <Link href="/register" className="hover:text-[#17201b]">
              Register
            </Link>
            <Link href="/dashboard" className="hover:text-[#17201b]">
              Dashboard
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}

export default Home;
