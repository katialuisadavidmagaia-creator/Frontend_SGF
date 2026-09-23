import { Outlet } from 'react-router-dom';
import { Sidebar } from '../sidebar';
import { Topbar } from './topbar';

export function DashboardLayout() {
  return (
    <div className="flex min-h-screen w-full bg-gray-50">
      <Sidebar />

      <div className="flex-1 min-w-0 flex flex-col">
        <Topbar titulo="Painel de Gestão" />

        <main className="flex-1 min-w-0 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;