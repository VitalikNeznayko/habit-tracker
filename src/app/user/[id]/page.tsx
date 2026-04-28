type Props = {
  params: {
    id: string;
  };
};

async function UserPage({ params }: Props) {
  const { id }: { id: string } = await params;
  return (
    <div>
      <h1>User Page</h1>
      <p>User ID: {id}</p>
    </div>
  );
}

export default UserPage;
