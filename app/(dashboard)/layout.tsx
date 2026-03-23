export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* TODO: <Sidebar /> */}
      <div className="flex flex-1 flex-col">
        {/* TODO: <Navbar /> */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
