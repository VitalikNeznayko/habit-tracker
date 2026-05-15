type Props = {
  email: string;
  joinedAt: string;
  onChangePassword: () => void;
  mode?: "overview" | "password";
  hasPassword: boolean;
};

export default function ProfileCard({
  email,
  joinedAt,
  onChangePassword,
  mode = "overview",
  hasPassword,
}: Props) {
  return (
    <div className="rounded-lg border border-[#dce3dc] bg-white p-5 shadow-sm">
      <div className="grid h-16 w-16 place-items-center rounded-lg bg-[#17201b] text-2xl font-bold text-white">
        {email.slice(0, 1).toUpperCase()}
      </div>

      <h2 className="mt-5 break-words text-2xl font-bold">{email}</h2>

      <p className="mt-2 text-sm text-[#6e7f72]">Joined {joinedAt}</p>

      {!hasPassword ||
        (mode === "overview" && (
          <button
            onClick={onChangePassword}
            className="mt-5 inline-flex min-h-11 items-center justify-center rounded-md border border-[#cbd4cc] bg-white px-4 py-2 text-sm font-semibold transition hover:border-[#9fab9f]"
          >
            Change password
          </button>
        ))}
    </div>
  );
}
