export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <div>
      <h1 className="text-2xl font-bold">Neighbor Profile</h1>
      <p className="text-muted-foreground">Viewing profile: {slug}</p>
      {/* TODO: Fetch user by slug, display public profile */}
      {/* TODO: <TrustScore /> display */}
      {/* TODO: Contact / message button */}
    </div>
  );
}
