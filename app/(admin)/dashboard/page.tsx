import { FlaggedContentTable } from "@/components/admin/FlaggedContentTable";
import { StatsOverview } from "@/components/admin/StatsOverview";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Moderation tools and community oversight.
        </p>
      </div>

      <StatsOverview />

      <FlaggedContentTable />

      {/* TODO: <UserManagementTable /> user list with actions */}
    </div>
  );
}
