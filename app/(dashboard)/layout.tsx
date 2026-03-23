import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";
import { HeroAlert } from "@/components/notifications/HeroAlert";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Navbar />
        <main className="flex-1 p-6 md:p-8">
          <HeroAlert />
          {children}
        </main>
      </div>
    </div>
  );
}
