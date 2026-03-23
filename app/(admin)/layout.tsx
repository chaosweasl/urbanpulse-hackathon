export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* TODO: Role check — redirect non-admin users */}
      {/* TODO: <AdminSidebar /> */}
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
