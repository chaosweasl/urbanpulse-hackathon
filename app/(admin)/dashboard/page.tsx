export default function AdminDashboardPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <p className="text-muted-foreground">
        Moderation tools and community oversight.
      </p>
      {/* TODO: <StatsOverview /> key metrics cards */}
      {/* TODO: <ReportTable /> reported posts */}
      {/* TODO: <UserManagementTable /> user list with actions */}
    </div>
  );
}
