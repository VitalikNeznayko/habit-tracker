
import Link from "next/link";

function Home() {
  return (
    <main className="min-h-screen bg-[#f6f7f4] px-5 py-6 text-[#17201b] sm:px-8">
      <nav className="mx-auto flex max-w-6xl items-center justify-between">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          Habit Tracker
        </Link>
        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className="rounded-md px-4 py-2 text-sm font-medium text-[#3c493f] transition hover:bg-white"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="rounded-md bg-[#17201b] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#28352d]"
          >
            Start
          </Link>
        </div>
      </nav>

      <section className="mx-auto grid max-w-6xl gap-10 py-14 lg:grid-cols-[1fr_440px] lg:items-center lg:py-20">
        <div>
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-[#6e7f72]">
            Daily habit companion
          </p>
          <h1 className="max-w-3xl text-5xl font-bold leading-[1.02] tracking-tight text-[#121a15] sm:text-6xl">
            Habit Tracker
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-[#526056]">
            Keep your routines visible, mark today in one tap, and follow the
            streaks that make progress feel real.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/register"
              className="rounded-md bg-[#17201b] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#28352d]"
            >
              Create account
            </Link>
            <Link
              href="/login"
              className="rounded-md border border-[#cbd4cc] bg-white px-5 py-3 text-sm font-semibold text-[#17201b] transition hover:border-[#9fab9f]"
            >
              I have an account
            </Link>
          </div>
        </div>

        <div className="rounded-lg border border-[#dce3dc] bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-[#17201b]">Today</p>
              <p className="text-xs text-[#6e7f72]">3 of 5 completed</p>
            </div>
            <div className="rounded-md bg-[#eaf4ec] px-3 py-2 text-sm font-semibold text-[#2f6f45]">
              60%
            </div>
          </div>
          <div className="space-y-3">
            {["Morning walk", "Read 20 pages", "Plan tomorrow"].map(
              (habit, index) => (
                <div
                  key={habit}
                  className="flex items-center justify-between rounded-md border border-[#eef1ee] bg-[#fbfcfa] p-3"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`grid h-6 w-6 place-items-center rounded-md border text-[10px] font-bold ${
                        index < 2
                          ? "border-[#3b8f55] bg-[#3b8f55] text-white"
                          : "border-[#cbd4cc] bg-white text-transparent"
                      }`}
                    >
                      OK
                    </span>
                    <span className="text-sm font-medium text-[#253029]">
                      {habit}
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-[#6e7f72]">
                    {index < 2 ? "Done" : "Open"}
                  </span>
                </div>
              ),
            )}
          </div>
          <div className="mt-5 h-2 overflow-hidden rounded-full bg-[#edf0ed]">
            <div className="h-full w-3/5 rounded-full bg-[#3b8f55]" />
          </div>
        </div>
      </section>
    </main>
  );
}

export default Home;
