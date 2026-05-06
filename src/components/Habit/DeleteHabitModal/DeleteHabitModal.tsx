"use client";

type DeleteHabitModalProps = {
  open: boolean;
  title: string;
  loading: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function DeleteHabitModal({
  open,
  title,
  loading,
  onConfirm,
  onCancel,
}: DeleteHabitModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-xl border border-[#dce3dc] bg-white p-6 shadow-xl">
        <h2 className="text-xl font-bold text-[#17201b]">Delete habit?</h2>

        <p className="mt-3 text-sm leading-6 text-[#6e7f72]">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-[#17201b]">{title}</span>? This
          action cannot be undone.
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="rounded-md border border-[#cbd4cc] bg-white px-4 py-2 text-sm font-semibold transition hover:border-[#9fab9f] disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            disabled={loading}
            className="rounded-md border border-[#d9a7a7] bg-[#fff8f8] px-4 py-3 text-sm font-semibold text-[#8a2f2f] transition hover:border-[#bd7676] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
