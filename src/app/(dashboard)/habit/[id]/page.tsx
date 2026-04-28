
type Props = {
  params: {
    id: string;
  };
};

async function HabitPage({ params }: Props) {
  const { id }: { id: string } = await params;
  return (
    <div>
      <h1>Habit Page</h1>
      <p>Habit ID: {id}</p>
    </div>
  );
}

export default HabitPage;
