import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (token && storedUser) {
        try {
          const response = await authService.getProfile();
          const currentUser = response.data.user;
          setUser(currentUser);
          setIsAuthenticated(true);
          localStorage.setItem('user', JSON.stringify(currentUser));
        } catch (error) {
          console.error('getProfile failed:', error.response?.data || error.message);
          clearLocalAuth();
        }
      } else {
        clearLocalAuth();
      }

      setLoading(false);
    };

    checkAuth();
  }, []);

<<<<<<< HEAD
=======
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

>>>>>>> 55a65d1888d462874d7326a2a15035e30f1b00f9
  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await authService.login(email, password);
<<<<<<< HEAD
      if (response.success) {
        const userData = response.data.user;
        const token = response.data.token;

        setUser(userData);
        setIsAuthenticated(true);
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        return { success: true };
      } else {
        return { success: false, error: response.message || "Error logging in" };
      }
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, error: error.message || "Unexpected error" };
=======

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
>>>>>>> 55a65d1888d462874d7326a2a15035e30f1b00f9
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await authService.register(userData);
<<<<<<< HEAD
      if (response.success) {
        const newUser = response.data.user;
        const token = response.data.token;

        setUser(newUser);
        setIsAuthenticated(true);
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(newUser));
        return { success: true };
      } else {
        return { success: false, error: response.message || 'Registration failed' };
      }
    } catch (error) {
      console.error('Register error:', error);
      return { success: false, error: error.message || 'Unexpected error' };
=======

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
>>>>>>> 55a65d1888d462874d7326a2a15035e30f1b00f9
    } finally {
      setLoading(false);
    }
  };

<<<<<<< HEAD
  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      clearLocalAuth();
    }
  };

  const clearLocalAuth = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
  };

=======
  const logout = () => {
    authService.logout?.();
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

>>>>>>> 55a65d1888d462874d7326a2a15035e30f1b00f9
  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const refreshUser = async () => {
    try {
      const response = await authService.getProfile();
      const userData = response.data.user;
<<<<<<< HEAD
=======
      if (userData._id && !userData.id) {
        userData.id = userData._id;
      }

>>>>>>> 55a65d1888d462874d7326a2a15035e30f1b00f9
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
<<<<<<< HEAD
    return type !== 'free' && isActive && (!endDate || new Date(endDate) > new Date());
=======
    if (type === 'free' || !isActive) return false;
    if (endDate && new Date(endDate) < new Date()) return false;
    return true;
>>>>>>> 55a65d1888d462874d7326a2a15035e30f1b00f9
  };

  const hasRole = (role) => user?.role === role;

  const hasAnyRole = (roles) => roles.includes(user?.role);
<<<<<<< HEAD

  return (
    <AuthContext.Provider
      value={{
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
=======

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
>>>>>>> 55a65d1888d462874d7326a2a15035e30f1b00f9
