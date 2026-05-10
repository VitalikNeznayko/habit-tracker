type LoaderProps = {
  label?: string;
  size?: "sm" | "md";
};

export function Loader({ label, size = "md" }: LoaderProps) {
  const dim = size === "sm" ? "h-4 w-4 border-2" : "h-5 w-5 border-[3px]";

  return (
    <div className="flex items-center justify-center gap-3">
      <span
        aria-hidden
        className={`${dim} inline-block animate-spin rounded-full border-[#cbd4cc] border-t-[#2f6f45]`}
      />
      {label ? <span>{label}</span> : null}
    </div>
  );
}

export function PageLoader({ label = "Loading..." }: { label?: string }) {
  return (
    <main
      role="status"
      aria-live="polite"
      className="grid min-h-screen place-items-center bg-[#f6f7f4] px-5 text-[#17201b]"
    >
      <div className="rounded-lg border border-[#dce3dc] bg-white px-5 py-4 text-sm font-semibold shadow-sm">
        <Loader label={label} />
      </div>
    </main>
  );
}

export default Loader;
