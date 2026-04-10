import { Sidebar } from "@/components/layout/Sidebar";
import { Navbar } from "@/components/layout/Navbar";
import { HeroAlert } from "@/components/notifications/HeroAlert";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen bg-background">
      <Sidebar />
      <div className="flex flex-1 flex-col md:pl-72">
        <Navbar />
        <main className="relative z-10 flex-1 px-4 pb-[calc(6.75rem+env(safe-area-inset-bottom))] pt-[calc(4.75rem+env(safe-area-inset-top))] md:px-8 md:pb-10 md:pt-8">
          <HeroAlert />
          {children}
        </main>
      </div>
    </div>
  );
}
