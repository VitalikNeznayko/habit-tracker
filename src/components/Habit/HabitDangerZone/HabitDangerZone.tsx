type Props = {
  onDelete: () => void;
  deleting: boolean;
};

export default function HabitDangerZone({ onDelete, deleting }: Props) {
  return (
    <section className="mt-4 rounded-lg border border-[#ead2d2] bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-semibold text-[#3f2020]">Danger zone</h2>

          <p className="mt-1 text-sm text-[#8a5f5f]">
            Deleting a habit also removes its check-in history.
          </p>
        </div>

        <button
          onClick={onDelete}
          disabled={deleting}
          className="rounded-md border border-[#d9a7a7] bg-[#fff8f8] px-4 py-3 text-sm font-semibold text-[#8a2f2f] transition hover:border-[#bd7676] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {deleting ? "Deleting..." : "Delete habit"}
        </button>
      </div>
    </section>
  );
}
