import { createClient } from "@/utils/supabase/server";
import { requireAdmin } from "@/lib/api-helpers";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  try {
    await requireAdmin(supabase);
  } catch (error) {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen bg-muted/20">
      {/* TODO: <AdminSidebar /> */}
      <main className="flex-1 p-6 md:p-8">{children}</main>
    </div>
  );
}
