import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '../context/authcontext';
import { ProtectedRoute } from './protectedRoutes';

import Login from '../pages/auth/login';
import RecuperarPassword from '../pages/auth/recuperarPassword';
import RedefinirPassword from '../pages/auth/redefinirpassword';
import DetalhesFuncionario from 'src/pages/Funcionario/detalhesFuncionario';
import { DashboardLayout } from '../components/layout/dashboardLayout';
import EditarFuncionario from 'src/pages/Funcionario/editarFuncionario';
import ListarFuncionario from '../pages/Funcionario/listarFuncionario';
import Projetos from 'src/pages/Projetos';
import Perfil from '../pages/perfil';
import RelatoriosPage from '../pages/relatorios';
import { Departamentos } from 'src/pages/departamento';

function NaoAutorizado() {
  return (
    <div className="p-6">
      Não tem permissão para aceder a esta página.
    </div>
  );
}

function NaoEncontrado() {
  return (
    <div className="p-6">
      Página não encontrada.
    </div>
  );
}

export function AppRoutes() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>

          {/* ==================== */}
          {/* ROTAS PÚBLICAS       */}
          {/* ==================== */}

          <Route path="/login" element={<Login />} />

          <Route
            path="/recuperar-password"
            element={<RecuperarPassword />}
          />

          <Route
            path="/redefinir-password"
            element={<RedefinirPassword />}
          />

          <Route
            path="/nao-autorizado"
            element={<NaoAutorizado />}
          />


          {/* ==================== */}
          {/* ÁREA AUTENTICADA      */}
          {/* ==================== */}

          <Route element={<ProtectedRoute />}>

            <Route
              path="/dashboard"
              element={<DashboardLayout />}
            >

              {/* /dashboard → /dashboard/funcionarios */}
              <Route
                index
                element={
                  <Navigate
                    to="funcionarios"
                    replace
                  />
                }
              />

              {/* FUNCIONÁRIOS */}
              <Route
                path="funcionarios"
                element={<ListarFuncionario />}
              />

              <Route path="/funcionarios/:id" element={<DetalhesFuncionario />} />
      <Route path="/funcionarios/editar/:id" element={<EditarFuncionario />} />
    

              {/* DEPARTAMENTOS */}
              <Route
                path="departamentos"
                element={
                  <ProtectedRoute
                    modulo="departamentos"
                    accao="ver"
                  >
                    <Departamentos />
                  </ProtectedRoute>
                }
              />

              {/* PROJETOS */}
              <Route
                path="projetos"
                element={
                  <ProtectedRoute
                    modulo="projetos"
                    accao="ver"
                  >
                    <Projetos />
                  </ProtectedRoute>
                }
              />

              {/* RELATÓRIOS */}
              <Route
                path="relatorios"
                element={
                  <ProtectedRoute
                    modulo="relatorios"
                    accao="ver"
                  >
                    <RelatoriosPage />
                  </ProtectedRoute>
                }
              />

              {/* PERFIL */}
              <Route
                path="perfil"
                element={<Perfil />}
              />

            </Route>

          </Route>


          {/* ==================== */}
          {/* REDIRECIONAMENTOS     */}
          {/* ==================== */}

          <Route
            path="/"
            element={
              <Navigate
                to="/dashboard"
                replace
              />
            }
          />

          <Route
            path="*"
            element={<NaoEncontrado />}
          />

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );

  
}