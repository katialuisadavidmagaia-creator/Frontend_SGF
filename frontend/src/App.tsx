import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

import Login from './pages/login';
import Registo from './pages/registo';
import Dashboard from './pages/dashboard';
import Recuperar from './pages/recuperar'; 
import EditarFuncionario from './components/editarFuncionario';
import DetalhesFuncionario from './components/DetalhesFuncionario.tsx';

const isAutenticado = () => !!localStorage.getItem('token');


const RotaProtegida = ({ children }: { children: React.ReactNode}) => {
  return isAutenticado() ? <>{children}</> : <Navigate to="/" replace />;
};

function App() {
  return (
    <div className="app"> 
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/registo" element={<Registo />} />
          <Route path="/recuperar" element={<Recuperar />} /> 
          
          
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