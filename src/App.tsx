import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

import Login from './pages/login';
import Registo from './pages/registo';
import Dashboard from './pages/dashboard';
import Recuperar from './pages/recuperar'; 
import RedefinirPassword from './pages/redefinirPassword'; 
import EditarFuncionario from './components/editarFuncionario';
import DetalhesFuncionario from './components/detalhesFuncionario';

const isAutenticado = () => !!localStorage.getItem('token');

const RotaProtegida = ({ children }: { children: React.ReactNode }) => {
  return isAutenticado() ? <>{children}</> : <Navigate to="/" replace />;
};

function App() {
  return (
    <div className="app"> 
      <BrowserRouter>
        <Routes>
          {/* Rotas Públicas */}
          <Route path="/" element={<Login />} />
          <Route path="/registo" element={<Registo />} />
          <Route path="/recuperar" element={<Recuperar />} /> {/* Adicionada para o formulário de pedido funcionar */}
          <Route path="/redefinir-password" element={<RedefinirPassword />} />
          
          {/* Rotas Protegidas (Dashboard) */}
          <Route 
            path="/dashboard" 
            element={
              <RotaProtegida>
                <Dashboard />
              </RotaProtegida>
            } 
          />
          <Route 
            path="/dashboard/editar-funcionario/:id" 
            element={
              <RotaProtegida>
                <EditarFuncionario />
              </RotaProtegida>
            } 
          />
          <Route 
            path="/dashboard/funcionario/:id" 
            element={
              <RotaProtegida>
                <DetalhesFuncionario />
              </RotaProtegida>
            } 
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;