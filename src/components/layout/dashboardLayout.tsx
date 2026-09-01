import { useNavigate, Outlet } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { Sidebar } from '../sidebar';
import { useTranslation } from 'react-i18next';




function iniciaisDoEmail(email: string) {
  const nomeParte = email.split('@')[0] ?? '';
  const letras = nomeParte.replace(/[^a-zA-Z]/g, '');
  return (letras.slice(0, 2) || 'U').toUpperCase();
}

export function DashboardLayout() {
  const{t}=useTranslation();
  const navigate = useNavigate();
  const email = localStorage.getItem('email') || 'Utilizador';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
    navigate('/');
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <header className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-200">
          <h2 className="text-lg font-bold text-[#0E1A2B]">Painel de Gestão</h2>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="flex items-center justify-center h-8 w-8 rounded-full bg-[#4F6EF7] text-white text-xs font-bold">
                {iniciaisDoEmail(email)}
              </span>
              <span className="text-sm text-gray-600 hidden sm:inline">{email}</span>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm font-medium text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg px-3 py-2 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Sair
            </button>
          </div>
        </header>

        <section className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </section>
      </div>
    </div>
  );
}

export default DashboardLayout;