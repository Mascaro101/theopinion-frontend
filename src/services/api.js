import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

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
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      const tokenExpiredEvent = new CustomEvent("tokenExpired");
      window.dispatchEvent(tokenExpiredEvent);
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
      throw new Error(error.response?.data?.message || error.message || 'Error de conexión');
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
      throw new Error(error.response?.data?.message || error.message || 'Error de conexión');
    }
  },

  logout: async () => {
    authService.clearLocalAuth();
  },

  clearLocalAuth: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getProfile: async () => {
    const user = localStorage.getItem('user');
    const userId = user ? JSON.parse(user).id : null;
    if (!userId) throw new Error('No user ID found');
    const response = await api.get(`/users/${userId}`);
    return response.data;
  },

  getUserById: async (id) => {
    if (!id) throw new Error('No user ID provided');
    const response = await api.get(`/users/${id}`);
    return response.data;
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

  changePassword: async (currentPassword, newPassword) => {
    const response = await api.post('/auth/change-password', {
      currentPassword,
      newPassword,
    });
    return response.data;
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

  searchArticles: async (query, filters = {}) => {
    const response = await api.get('/articles/search', {
      params: { q: query, ...filters },
    });
    return response.data;
  },
};

export const categoryService = {
  getCategories: async () => {
    const response = await api.get('/categories');
    return response.data;
  },
};

export default api;