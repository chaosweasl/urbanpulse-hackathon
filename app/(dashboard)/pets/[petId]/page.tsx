export default async function PetDetailPage({
  params,
}: {
  params: Promise<{ petId: string }>;
}) {
  const { petId } = await params;

  return (
    <div>
      <h1 className="text-2xl font-bold">Pet Details</h1>
      <p className="text-muted-foreground">Pet report ID: {petId}</p>
      {/* TODO: Pet photo + details */}
      {/* TODO: <PetMatchResults /> AI similarity matches */}
    </div>
  );
}
