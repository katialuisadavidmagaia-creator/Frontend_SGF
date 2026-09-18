import { Outlet } from 'react-router-dom';
import { Sidebar } from '../sidebar';
import { Topbar } from './topbar';

export function DashboardLayout() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        {/* Substituído o header estático pela Topbar dinâmica */}
        <Topbar titulo="Painel de Gestão" />

        <section className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </section>
      </div>
    </div>
  );
}

export default DashboardLayout;