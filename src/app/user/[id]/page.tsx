type Props = {
  params: Promise<{
    id: string;
  }>;
};

async function UserPage({ params }: Props) {
  const { id } = await params;
  return (
    <main className="min-h-screen bg-[#f6f7f4] px-5 py-10 text-[#17201b]">
      <section className="mx-auto max-w-2xl rounded-lg border border-[#dce3dc] bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase text-[#6e7f72]">
          Profile
        </p>
        <h1 className="mt-2 text-3xl font-bold">User page</h1>
        <p className="mt-4 rounded-md bg-[#fbfcfa] px-3 py-3 text-sm text-[#3c493f]">
          User ID: {id}
        </p>
      </section>
    </main>
  );
}

export default UserPage;
