import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:4003/api',
});

// Interceptor de Requisição: Anexa o token Bearer
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Interceptor de Resposta: Captura erros de autenticação
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Se o backend responder 401 por qualquer motivo (token expirado, inválido ou em falta)
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('utilizador');
      localStorage.removeItem('email');
      
      // Redireciona para o login apenas se já não estiver na página de login
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);