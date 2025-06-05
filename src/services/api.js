import axios from 'axios';

// Configuración base de la API
const API_BASE_URL = 'http://localhost:5000/api';

// Crear instancia de axios
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Interceptor para agregar el token a las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas y errores
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Servicios de autenticación
export const authService = {
  // Login
  login: async (email, password) => {
    try {
      const response = await api.post('/users/login', { email, password });
      
      if (response.data.success) {
        const { token, user } = response.data.data;
        
        // Guardar token y usuario en localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        return response.data;
      } else {
        throw new Error(response.data.message || 'Error al iniciar sesión');
      }
    } catch (error) {
      if (error.response?.data) {
        throw new Error(error.response.data.message || 'Error al iniciar sesión');
      }
      throw new Error(error.message || 'Error de conexión');
    }
  },

  // Registro
  register: async (userData) => {
    try {
      const response = await api.post('/users/register', userData);
      
      if (response.data.success) {
        const { token, user } = response.data.data;
        
        // Guardar token y usuario en localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        
        return response.data;
      } else {
        throw new Error(response.data.message || 'Error al registrarse');
      }
    } catch (error) {
      if (error.response?.data) {
        throw new Error(error.response.data.message || 'Error al registrarse');
      }
      throw new Error(error.message || 'Error de conexión');
    }
  },

  // Logout
  logout: async () => {
    try {
      // Intentar hacer logout en el backend
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Backend logout error:', error);
      // No lanzar error aquí, ya que queremos limpiar el estado local de todos modos
    }
  },

  // Limpiar autenticación local
  clearLocalAuth: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Obtener perfil del usuario
  getProfile: async () => {
    try {
      const response = await api.get('/users/me');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error de conexión' };
    }
  },

  // Verificar si el usuario está autenticado
  isAuthenticated: () => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    return !!(token && user);
  },

  // Obtener usuario actual
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Cambiar contraseña
  changePassword: async (currentPassword, newPassword) => {
    try {
      const response = await api.post('/auth/change-password', {
        currentPassword,
        newPassword
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error de conexión' };
    }
  }
};

// Servicios de artículos
export const articleService = {
  // Obtener todos los artículos
  getArticles: async (params = {}) => {
    try {
      const response = await api.get('/articles', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error de conexión' };
    }
  },

  // Obtener artículo por ID
  getArticleById: async (id) => {
    try {
      const response = await api.get(`/articles/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error de conexión' };
    }
  },

  // Buscar artículos
  searchArticles: async (query, filters = {}) => {
    try {
      const response = await api.get('/articles/search', {
        params: { q: query, ...filters }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error de conexión' };
    }
  }
};

// Servicios de categorías
export const categoryService = {
  // Obtener todas las categorías
  getCategories: async () => {
    try {
      const response = await api.get('/categories');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Error de conexión' };
    }
  }
};

export default api; 