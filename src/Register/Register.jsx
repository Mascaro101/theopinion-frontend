import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "./Register.css";

function Register() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: ""
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const paymentData = location.state?.paymentData;
  const subscriptionInfo = location.state?.subscriptionInfo;
  const message = location.state?.message;

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  // Prellenar datos del pago si están disponibles
  useEffect(() => {
    if (paymentData) {
      setFormData(prev => ({
        ...prev,
        email: paymentData.email || "",
        firstName: paymentData.firstName || "",
        lastName: paymentData.lastName || ""
      }));
    }
  }, [paymentData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Limpiar errores cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ""
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Validar email
    if (!formData.email) {
      newErrors.email = "El email es requerido";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "El email no es válido";
    }

    // Validar contraseña con requisitos más estrictos
    if (!formData.password) {
      newErrors.password = "La contraseña es requerida";
    } else if (formData.password.length < 8) {
      newErrors.password = "La contraseña debe tener al menos 8 caracteres";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(formData.password)) {
      newErrors.password = "La contraseña debe contener al menos: 1 mayúscula, 1 minúscula, 1 número y 1 carácter especial";
    }

    // Validar confirmación de contraseña
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirma tu contraseña";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden";
    }

    // Validar nombre
    if (!formData.firstName.trim()) {
      newErrors.firstName = "El nombre es requerido";
    }

    // Validar apellido
    if (!formData.lastName.trim()) {
      newErrors.lastName = "El apellido es requerido";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const userData = {
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        // Agregar información de suscripción si está disponible
        subscriptionInfo: subscriptionInfo ? {
          planId: subscriptionInfo.planId,
          planName: subscriptionInfo.planName,
          fromPayment: true
        } : null
      };

      const result = await register(userData);
      
      if (result.success) {
        // Registro exitoso, redirigir al home
        navigate("/");
      } else {
        // Manejar errores específicos del backend
        if (result.error.includes("already exists") || result.error.includes("Registration failed")) {
          setErrors({ 
            email: "Este email ya está registrado" 
          });
        } else if (result.error.includes("Password") && result.error.includes("secure")) {
          setErrors({ 
            password: "La contraseña no cumple con los requisitos de seguridad" 
          });
        } else if (result.error.includes("Too many")) {
          setErrors({ 
            general: "Demasiados intentos de registro. Intenta más tarde." 
          });
        } else {
          setErrors({ 
            general: result.error || "Error al registrarse" 
          });
        }
      }
    } catch (error) {
      console.error("Register error:", error);
      setErrors({ 
        general: "Error de conexión. Verifica tu conexión a internet." 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <h2>Create Account</h2>
        {message ? (
          <p className="register-subtitle">{message}</p>
        ) : (
          <p className="register-subtitle">Join our community today</p>
        )}
        
        {subscriptionInfo && (
          <div className="plan-info">
            <p>
              🎉 ¡Activando tu plan <strong>{subscriptionInfo.planName}</strong>! 
              <br />
              <small>Completa tu registro para comenzar a disfrutar de todos los beneficios</small>
            </p>
          </div>
        )}
        
        {errors.general && (
          <div className="error-message general-error">
            {errors.general}
          </div>
        )}
        
        <form className="register-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">First Name</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                placeholder="John"
                className={`form-input ${errors.firstName ? 'error' : ''}`}
                disabled={isLoading}
              />
              {errors.firstName && (
                <span className="error-message">{errors.firstName}</span>
              )}
            </div>
            
            <div className="form-group">
              <label htmlFor="lastName">Last Name</label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                placeholder="Doe"
                className={`form-input ${errors.lastName ? 'error' : ''}`}
                disabled={isLoading}
              />
              {errors.lastName && (
                <span className="error-message">{errors.lastName}</span>
              )}
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="your@email.com"
              className={`form-input ${errors.email ? 'error' : ''}`}
              disabled={isLoading}
            />
            {errors.email && (
              <span className="error-message">{errors.email}</span>
            )}
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-input-container">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Enter your password"
                className={`form-input ${errors.password ? 'error' : ''}`}
                disabled={isLoading}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={togglePasswordVisibility}
                disabled={isLoading}
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
            <div className="password-help">
              <small>La contraseña debe tener al menos 8 caracteres, incluyendo mayúsculas, minúsculas, números y símbolos</small>
            </div>
            {errors.password && (
              <span className="error-message">{errors.password}</span>
            )}
          </div>
          
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Confirm your password"
              className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
              disabled={isLoading}
            />
            {errors.confirmPassword && (
              <span className="error-message">{errors.confirmPassword}</span>
            )}
          </div>
          
          <button 
            type="submit" 
            className="register-submit-button"
            disabled={isLoading}
          >
            {isLoading ? "Creating Account..." : "Create Account"}
          </button>
        </form>
        
        <div className="register-footer">
          <p>Already have an account? <Link to="/login" className="login-link">Sign in</Link></p>
        </div>
      </div>
    </div>
  );
}

export default Register; 