import { FlaggedContentTable } from "@/components/admin/FlaggedContentTable";
import { StatsOverview } from "@/components/admin/StatsOverview";
import { UserManagementTable } from "@/components/admin/UserManagementTable";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-12 pb-12">
      <div className="mb-12">
        <p className="mb-1 text-xs uppercase tracking-widest text-zinc-500">Admin</p>
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Moderation</h1>
      </div>

      <StatsOverview />

      <div className="grid grid-cols-1 gap-12">
        <FlaggedContentTable />
        <UserManagementTable />
      </div>
    </div>
  );
}
