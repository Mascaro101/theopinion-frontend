import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (token && storedUser) {
          try {
            const response = await authService.getProfile();
            const currentUser = response?.data?.user;

            if (!currentUser) throw new Error('Usuario no válido');

            if (currentUser._id && !currentUser.id) {
              currentUser.id = currentUser._id;
            }

            setUser(currentUser);
            setIsAuthenticated(true);
            localStorage.setItem('user', JSON.stringify(currentUser));
          } catch (error) {
            console.warn('Token expirado o inválido:', error?.message);
            logout();
          }
        } else {
          logout();
        }
      } catch (error) {
        console.error('Error al verificar autenticación:', error);
        logout();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // 🔁 Logout automático si el token expira
  useEffect(() => {
    const handleTokenExpired = () => {
      console.warn('⚠️ Token expirado. Cerrando sesión.');
      logout();
      navigate('/');
    };

    window.addEventListener('tokenExpired', handleTokenExpired);
    return () => window.removeEventListener('tokenExpired', handleTokenExpired);
  }, [navigate]);

  // 🕒 Logout por inactividad después de 2 minutos
  useEffect(() => {
    let timeout;
    const resetTimer = () => {
      clearTimeout(timeout);
      if (isAuthenticated) {
        timeout = setTimeout(() => {
          console.log('⏳ Sesión cerrada por inactividad');
          logout();
          navigate('/');
        }, 120000); // 2 minutos
      }
    };

    const events = ['mousemove', 'keydown', 'click', 'scroll'];
    events.forEach(event => window.addEventListener(event, resetTimer));
    resetTimer();

    return () => {
      clearTimeout(timeout);
      events.forEach(event => window.removeEventListener(event, resetTimer));
    };
  }, [isAuthenticated, navigate]);

  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await authService.login(email, password);

      if (response.success) {
        const userData = response.data.user;
        if (userData._id && !userData.id) {
          userData.id = userData._id;
        }

        setUser(userData);
        setIsAuthenticated(true);
        localStorage.setItem('user', JSON.stringify(userData));
        console.log('🔐 Usuario logueado:', userData); // 👈 console log añadido
        return { success: true, data: response };
      } else {
        return { success: false, error: response.message || 'Error al iniciar sesión' };
      }
    } catch (error) {
      console.error('Login error:', error);
      setUser(null);
      setIsAuthenticated(false);
      return {
        success: false,
        error: error.message || error.response?.data?.message || 'Error de conexión',
      };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await authService.register(userData);

      if (response.success) {
        const newUser = response.data.user;
        if (newUser._id && !newUser.id) {
          newUser.id = newUser._id;
        }

        setUser(newUser);
        setIsAuthenticated(true);
        localStorage.setItem('user', JSON.stringify(newUser));
        console.log('📝 Usuario registrado:', newUser); // 👈 console log añadido
        return { success: true, data: response };
      } else {
        return { success: false, error: response.message || 'Error al registrarse' };
      }
    } catch (error) {
      console.error('Register error:', error);
      setUser(null);
      setIsAuthenticated(false);
      return {
        success: false,
        error: error.message || error.response?.data?.message || 'Error de conexión',
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout?.();
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const refreshUser = async () => {
    try {
      const response = await authService.getProfile();
      const userData = response.data.user;
      if (userData._id && !userData.id) {
        userData.id = userData._id;
      }

      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      return { success: true, data: userData };
    } catch (error) {
      console.error('Error al refrescar usuario:', error);
      return { success: false, error: error.message };
    }
  };

  const hasPremiumAccess = () => {
    if (!user || !user.subscription) return false;
    const { type, isActive, endDate } = user.subscription;
    if (type === 'free' || !isActive) return false;
    if (endDate && new Date(endDate) < new Date()) return false;
    return true;
  };

  const hasRole = (role) => user?.role === role;

  const hasAnyRole = (roles) => roles.includes(user?.role);

  // Mostrar datos del usuario cada vez que se actualiza
  useEffect(() => {
    if (user) {
      console.log("🧾 Datos del usuario autenticado:");
      console.log("Token:", localStorage.getItem("token"));
      console.log("Email:", user.email);
      console.log("Nombre:", user.name);
      console.log("Rol:", user.role);
      console.log("ID:", user.id || user._id);
    }
  }, [user]);

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    updateUser,
    refreshUser,
    hasPremiumAccess,
    hasRole,
    hasAnyRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};