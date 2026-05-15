import { Loader } from "@/components/Loader/Loader";

type Props = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  passwordError: string;
  passwordLoading: boolean;
  setCurrentPassword: (v: string) => void;
  setNewPassword: (v: string) => void;
  setConfirmPassword: (v: string) => void;
  onSubmit: () => void;
  onBack: () => void;
};

export default function ChangePasswordForm({
  currentPassword,
  newPassword,
  confirmPassword,
  passwordError,
  passwordLoading,
  setCurrentPassword,
  setNewPassword,
  setConfirmPassword,
  onSubmit,
  onBack,
}: Props) {
  return (
    <div className="min-w-0 rounded-lg border border-[#dce3dc] bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold">Change password</h2>

          <p className="mt-1 text-sm text-[#6e7f72]">
            Update your account password.
          </p>
        </div>

        <button
          onClick={onBack}
          className="inline-flex min-h-11 items-center justify-center self-start rounded-md border border-[#cbd4cc] bg-white px-3 py-2 text-sm font-semibold transition hover:border-[#9fab9f]"
        >
          Back
        </button>
      </div>

      <div className="mt-5 space-y-3">
        <input
          type="password"
          placeholder="Current password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          className="w-full rounded-md border border-[#cbd4cc] bg-[#fbfcfa] px-3 py-3 text-sm outline-none transition placeholder:text-[#91a094] focus:border-[#3b8f55] focus:bg-white"
          suppressHydrationWarning
        />

        <input
          type="password"
          placeholder="New password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full rounded-md border border-[#cbd4cc] bg-[#fbfcfa] px-3 py-3 text-sm outline-none transition placeholder:text-[#91a094] focus:border-[#3b8f55] focus:bg-white"
          suppressHydrationWarning
        />

        <input
          type="password"
          placeholder="Confirm new password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full rounded-md border border-[#cbd4cc] bg-[#fbfcfa] px-3 py-3 text-sm outline-none transition placeholder:text-[#91a094] focus:border-[#3b8f55] focus:bg-white"
          suppressHydrationWarning
        />

        {passwordError && (
          <p className="text-sm text-red-600">{passwordError}</p>
        )}

        <button
          onClick={onSubmit}
          disabled={passwordLoading}
          className="w-full rounded-md bg-[#17201b] py-3 text-sm font-semibold text-white transition hover:bg-[#28352d] disabled:cursor-not-allowed disabled:opacity-60"
          suppressHydrationWarning
        >
          {passwordLoading ? (
            <Loader size="sm" label="Updating..." />
          ) : (
            "Update password"
          )}
        </button>
      </div>
    </div>
  );
}
