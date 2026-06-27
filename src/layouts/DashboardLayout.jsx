import { Outlet } from 'react-router-dom';

/**
 * Shell layout for dashboard views (employer/candidate panels).
 */
export function DashboardLayout() {
  return (
    <div className="flex min-h-screen">
      <aside className="w-64 border-r border-gray-200 bg-white p-4">
        <span className="text-sm font-semibold text-gray-500">Dashboard</span>
      </aside>
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
}

export default DashboardLayout;
