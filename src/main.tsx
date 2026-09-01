import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { AuthProvider } from './context/authcontext';
import { ToastProvider } from './context/toastcontext';
import './index.css';
import './i18n'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <ToastProvider>
      <App />
      </ToastProvider>
    </AuthProvider>
  </StrictMode>
);