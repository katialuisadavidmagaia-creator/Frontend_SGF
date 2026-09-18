import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:4003/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response?.status === 401 &&
      error.response?.data?.codigo
    ) {
      const codigo = error.response.data.codigo;

      if (
        codigo === 'TOKEN_EXPIRADO' ||
        codigo === 'TOKEN_INVALIDO'
      ) {
        localStorage.removeItem('token');
        localStorage.removeItem('utilizador');
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);