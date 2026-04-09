import { FlaggedContentTable } from "@/components/admin/FlaggedContentTable";
import { StatsOverview } from "@/components/admin/StatsOverview";
import { UserManagementTable } from "@/components/admin/UserManagementTable";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-12 pb-12">
      <div className="mb-12">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-destructive mb-3">Admin</p>
        <h1 className="text-5xl font-black tracking-tighter">Moderation</h1>
      </div>

      <StatsOverview />

      <div className="grid grid-cols-1 gap-12">
        <FlaggedContentTable />
        <UserManagementTable />
      </div>
    </div>
  );
}
