import { FlaggedContentTable } from "@/components/admin/FlaggedContentTable";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Moderation tools and community oversight.
        </p>
      </div>

      {/* TODO: <StatsOverview /> key metrics cards */}

      <FlaggedContentTable />

      {/* TODO: <UserManagementTable /> user list with actions */}
    </div>
  );
}
