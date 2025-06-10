import axios from 'axios';

const API_BASE_URL = 'https://theopinion-backend-1.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if ([401, 403].includes(status)) {
      // Token expirado o inválido
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      // Evitar bucle infinito si ya estás en /login
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export const authService = {
  login: async (email, password) => {
    try {
      const response = await api.post('/users/login', { email, password });
      if (response.data.success) {
        const { token, user } = response.data.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        return response.data;
      } else {
        throw new Error(response.data.message || 'Error al iniciar sesión');
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message || 'Error al iniciar sesión');
    }
  },

  register: async (userData) => {
    try {
      const response = await api.post('/users/register', userData);
      if (response.data.success) {
        const { token, user } = response.data.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        return response.data;
      } else {
        throw new Error(response.data.message || 'Error al registrarse');
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || error.message || 'Error al registrarse');
    }
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Backend logout error:', error);
    }
  },

  clearLocalAuth: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getProfile: async () => {
    try {
      const user = localStorage.getItem('user');
      const userId = user ? JSON.parse(user).id : null;
      if (!userId) throw new Error('No user ID found');
      const response = await api.get(`/users/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error de conexión' };
    }
  },

  isAuthenticated: () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    return !!(token && user);
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
};

export const articleService = {
  getArticles: async (params = {}) => {
    const response = await api.get('/articles', { params });
    return response.data;
  },

  getArticleById: async (id) => {
    const response = await api.get(`/articles/${id}`);
    return response.data;
  },
};

export default api;
