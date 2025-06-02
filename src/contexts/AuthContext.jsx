import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

// Crear el contexto
const AuthContext = createContext();

// Hook personalizado para usar el contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

// Proveedor del contexto
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Verificar autenticación al cargar la aplicación
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');
        
        if (token && storedUser) {
          // Verificar que el token sigue siendo válido
          try {
            const response = await authService.getProfile();
            const currentUser = response.data.user;
            setUser(currentUser);
            setIsAuthenticated(true);
            // Actualizar datos del usuario en localStorage
            localStorage.setItem('user', JSON.stringify(currentUser));
          } catch (error) {
            // Token inválido, limpiar localStorage
            console.log('Token expired or invalid, clearing auth data:', error.message);
            authService.logout();
            setUser(null);
            setIsAuthenticated(false);
          }
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Error checking authentication:', error);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Función de login
  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await authService.login(email, password);
      
      if (response.success) {
        const userData = response.data.user;
        setUser(userData);
        setIsAuthenticated(true);
        return { success: true, data: response };
      } else {
        return { 
          success: false, 
          error: response.message || 'Error al iniciar sesión' 
        };
      }
    } catch (error) {
      console.error('Login error:', error);
      setUser(null);
      setIsAuthenticated(false);
      
      // Manejar diferentes tipos de errores
      let errorMessage = 'Error al iniciar sesión';
      
      if (error.message) {
        errorMessage = error.message;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.code === 'NETWORK_ERROR') {
        errorMessage = 'Error de conexión. Verifica tu conexión a internet.';
      }
      
      return { 
        success: false, 
        error: errorMessage
      };
    } finally {
      setLoading(false);
    }
  };

  // Función de registro
  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await authService.register(userData);
      
      if (response.success) {
        const newUser = response.data.user;
        setUser(newUser);
        setIsAuthenticated(true);
        return { success: true, data: response };
      } else {
        return { 
          success: false, 
          error: response.message || 'Error al registrarse' 
        };
      }
    } catch (error) {
      console.error('Register error:', error);
      setUser(null);
      setIsAuthenticated(false);
      
      // Manejar diferentes tipos de errores
      let errorMessage = 'Error al registrarse';
      
      if (error.message) {
        errorMessage = error.message;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.code === 'NETWORK_ERROR') {
        errorMessage = 'Error de conexión. Verifica tu conexión a internet.';
      }
      
      return { 
        success: false, 
        error: errorMessage
      };
    } finally {
      setLoading(false);
    }
  };

  // Función de logout
  const logout = async () => {
    try {
      // Intentar hacer logout en el backend
      await authService.logout();
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      // Siempre limpiar el estado local
      authService.clearLocalAuth();
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  // Función para actualizar el perfil del usuario
  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  // Función para refrescar los datos del usuario
  const refreshUser = async () => {
    try {
      const response = await authService.getProfile();
      const userData = response.data.user;
      
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      
      return { success: true, data: userData };
    } catch (error) {
      console.error('Error refreshing user:', error);
      return { success: false, error: error.message };
    }
  };

  // Verificar si el usuario tiene acceso premium
  const hasPremiumAccess = () => {
    if (!user || !user.subscription) return false;
    
    const { type, isActive, endDate } = user.subscription;
    
    if (type === 'free') return false;
    if (!isActive) return false;
    if (endDate && new Date(endDate) < new Date()) return false;
    
    return true;
  };

  // Verificar si el usuario tiene un rol específico
  const hasRole = (role) => {
    return user?.role === role;
  };

  // Verificar si el usuario tiene uno de varios roles
  const hasAnyRole = (roles) => {
    return roles.includes(user?.role);
  };

  const value = {
    // Estado
    user,
    loading,
    isAuthenticated,
    
    // Funciones de autenticación
    login,
    register,
    logout,
    
    // Funciones de usuario
    updateUser,
    refreshUser,
    
    // Funciones de permisos
    hasPremiumAccess,
    hasRole,
    hasAnyRole,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 