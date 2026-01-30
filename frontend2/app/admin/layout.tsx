import Sidebar from "../../components/Sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />

      {/* Admin content area */}
      <main className="flex-1 px-6 py-4 bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
        {children}
      </main>
    </div>
  );
}
