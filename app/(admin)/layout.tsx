import { createClient } from "@/utils/supabase/server";
import { requireAdmin } from "@/lib/api-helpers";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  try {
    await requireAdmin(supabase);
  } catch {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen bg-muted/20">
      <main className="flex-1 p-6 md:p-8">
        <div className="mb-8 flex items-center gap-4 border-b border-border/50 pb-4">
          <Link href="/feed" className="flex items-center gap-1 text-sm font-bold text-muted-foreground hover:text-foreground">
            ← Back to App
          </Link>
          <span className="text-border/50">|</span>
          <span className="text-xs font-black uppercase tracking-widest text-destructive">Admin Panel</span>
        </div>
        {children}
      </main>
    </div>
  );
}
