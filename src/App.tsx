import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Públicas
import LandingPage from './pages/landingPage';
import Login from './pages/auth/login';
import Registo from './pages/auth/registo';
import Recuperar from './pages/auth/recuperarPassword';
import RedefinirPassword from './pages/auth/redefinirpassword';

// Layout / Proteção
import DashboardLayout from './components/layout/dashboardLayout';
import { ProtectedRoute } from './routes/protectedRoutes';

// Páginas
import Dashboard from './pages/dashboard';
import Perfil from './pages/perfil';

import PerfilFuncionario from './pages/Funcionario/perfil';
import ListarFuncionario from './pages/Funcionario/listarFuncionario';
import DetalhesFuncionario from './pages/Funcionario/detalhesFuncionario';
import EditarFuncionario from './pages/Funcionario/editarFuncionario';
import { Departamentos } from './pages/departamento';
import Projetos from './pages/Projetos';

import Relatorios from './pages/relatorios';
import MeusRelatorios from './pages/dashboard/meusRelatorios'; 
import Aprovacoes from './pages/dashboard/aprovacoes';
import Estatisticas from './pages/dashboard/estatisticas';

import Calendario from './pages/topo/calendario';
import Usuarios from './pages/topo/usuarios';
import Tasks from './pages/topo/tasks';
import Settings from './pages/topo/settings';
import Membros from './pages/topo/membros';

import AcessoNegado from './pages/acessoNegado';

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* =====================================================
            PÁGINAS PÚBLICAS
        ===================================================== */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registo" element={<Registo />} />
        <Route path="/recuperar-password" element={<Recuperar />} />
        <Route path="/redefinir-password" element={<RedefinirPassword />} />

        {/* =====================================================
            ÁREA PROTEGIDA
        ===================================================== */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>

            {/* Dashboard Principal */}
            <Route path="/dashboard" element={<Dashboard />} />

            {/* Perfil */}
            <Route path="/dashboard/perfil" element={<Perfil />} />

            {/* FUNCIONÁRIOS E GESTÃO (RH / ADMIN) */}
            <Route element={<ProtectedRoute permitido={['ADMIN', 'RH']} />}>
              <Route path="/dashboard/funcionarios" element={<ListarFuncionario />} />
              <Route path="/dashboard/funcionarios/novo" element={<EditarFuncionario />} />
              <Route path="/dashboard/funcionarios/:id" element={<DetalhesFuncionario />} />
              <Route path="/dashboard/funcionarios/:id/editar" element={<EditarFuncionario />} />
              <Route path="/dashboard/funcionarios/:id/perfil" element={<PerfilFuncionario />} />
              
              <Route path="/dashboard/departamentos" element={<Departamentos />} />
              <Route path="/dashboard/projetos" element={<Projetos />} />
              <Route path="/dashboard/relatorios" element={<Relatorios />} />
              <Route path="/dashboard/aprovacoes" element={<Aprovacoes />} />
              <Route path="/dashboard/estatisticas" element={<Estatisticas />} />
              <Route path="/usuarios" element={<Usuarios />} />
            </Route>

            {/* FUNCIONÁRIO NORMAL */}
            <Route element={<ProtectedRoute permitido={['FUNCIONARIO']} />}>
              <Route path="/dashboard/meus-relatorios" element={<MeusRelatorios />} />
            </Route>

            {/* MENU SUPERIOR */}
            <Route path="/calendario" element={<Calendario />} />
            <Route path="/membros" element={<Membros />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/settings" element={<Settings />} />

          </Route>

          <Route path="/acesso-negado" element={<AcessoNegado />} />
        </Route>

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
        <Route path="/funcionarios" element={<Navigate to="/dashboard/funcionarios" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;