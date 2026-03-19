import { FlaggedContentTable } from "@/components/admin/FlaggedContentTable";
import { StatsOverview } from "@/components/admin/StatsOverview";
import { UserManagementTable } from "@/components/admin/UserManagementTable";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-12 pb-12">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Moderation tools and community oversight.
        </p>
      </div>

      <StatsOverview />

      <div className="grid grid-cols-1 gap-12">
        <FlaggedContentTable />
        <UserManagementTable />
      </div>
    </div>
  );
}
