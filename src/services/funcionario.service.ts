import axios from 'axios';


const AUTH_API_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:4003/api/auth';
const funcionarioApi = axios.create({
  baseURL: 'http://localhost:4003/api/funcionarios',
});


const authApi = axios.create({
  baseURL: AUTH_API_URL,
});



// Interceptor para adicionar token automaticamente
const addToken = (config: any) => {
  const token = localStorage.getItem('token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
};


// Aplicar interceptor nas APIs
authApi.interceptors.request.use(addToken);
funcionarioApi.interceptors.request.use(addToken);


// Tratar token inválido/expirado
const handleAuthError = (error: any) => {
  if (error.response?.status === 401) {
    const codigo = error.response?.data?.codigo;

    if (
      codigo === 'TOKEN_EXPIRADO' ||
      codigo === 'TOKEN_INVALIDO'
    ) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
  }

  return Promise.reject(error);
};


authApi.interceptors.response.use(
  response => response,
  handleAuthError
);

funcionarioApi.interceptors.response.use(
  response => response,
  handleAuthError
);


// Interfaces

export interface Funcionario {
  id: number;
  nome: string;
  email: string;
  role: string;
  [key: string]: any;
}


export interface LoginPayload {
  email: string;
  password: string;
}


export interface LoginResponse {
  sucesso: boolean;
  token: string;
  utilizador: Funcionario;
}


export interface CriarContaPayload {
  nome: string;
  email: string;
  password: string;
}


export interface ForgotPasswordPayload {
  email: string;
}


export interface ResetPasswordPayload {
  token: string;
  novaPassword: string;
}



// Service

const FuncionarioService = {

  async login(
    dados: LoginPayload
  ): Promise<LoginResponse> {

    const { data } = await authApi.post(
      '/login',
      dados
    );

    if (data.token) {
      localStorage.setItem(
        'token',
        data.token
      );
    }

    return data;
  },


  async criarConta(
    dados: CriarContaPayload
  ) {

    const { data } = await funcionarioApi.post(
      '/',
      dados
    );

    return data;
  },


  async forgotPassword(
    dados: ForgotPasswordPayload
  ) {

    const { data } = await authApi.post(
      '/forgot-password',
      dados
    );

    return data;
  },


  async resetPassword(
    dados: ResetPasswordPayload
  ) {

    const { data } = await authApi.post(
      '/reset-password',
      dados
    );

    return data;
  },


  async getProfile(): Promise<Funcionario> {

    const { data } = await authApi.get(
      '/profile'
    );

    return data;
  },

async listarTodos(): Promise<Funcionario[]> {
  const { data } = await funcionarioApi.get('/');

  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data?.dados)) {
    return data.dados;
  }

  if (Array.isArray(data?.data)) {
    return data.data;
  }

  return [];
},


  async atualizar(
    id: number,
    dados: Partial<Funcionario>
  ) {

    const { data } = await funcionarioApi.put(
      `/${id}`,
      dados
    );

    return data;
  },


  async eliminar(id: number) {

    const { data } = await funcionarioApi.delete(
      `/${id}`
    );

    return data;
  },


  logout() {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }

};


export default FuncionarioService;