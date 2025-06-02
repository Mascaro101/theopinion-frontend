import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "./Payment.css";

function Payment() {
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: '',
    email: '',
    firstName: '',
    lastName: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useAuth();
  
  const selectedPlan = location.state?.selectedPlan;

  useEffect(() => {
    if (!selectedPlan) {
      navigate('/subscription');
      return;
    }

    // Si el usuario está autenticado, prellenar algunos campos
    if (isAuthenticated && user) {
      setPaymentData(prev => ({
        ...prev,
        email: user.email || '',
        firstName: user.firstName || '',
        lastName: user.lastName || ''
      }));
    }
  }, [selectedPlan, navigate, isAuthenticated, user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Formatear número de tarjeta
    if (name === 'cardNumber') {
      const formatted = value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
      if (formatted.length <= 19) {
        setPaymentData(prev => ({ ...prev, [name]: formatted }));
      }
      return;
    }
    
    // Formatear fecha de expiración
    if (name === 'expiryDate') {
      const formatted = value.replace(/\D/g, '').replace(/(.{2})/, '$1/');
      if (formatted.length <= 5) {
        setPaymentData(prev => ({ ...prev, [name]: formatted }));
      }
      return;
    }
    
    // Limitar CVV a 3 dígitos
    if (name === 'cvv') {
      const formatted = value.replace(/\D/g, '');
      if (formatted.length <= 3) {
        setPaymentData(prev => ({ ...prev, [name]: formatted }));
      }
      return;
    }
    
    setPaymentData(prev => ({ ...prev, [name]: value }));
    
    // Limpiar errores cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!paymentData.cardNumber || paymentData.cardNumber.replace(/\s/g, '').length < 16) {
      newErrors.cardNumber = 'Card number must be 16 digits';
    }
    
    if (!paymentData.expiryDate || paymentData.expiryDate.length < 5) {
      newErrors.expiryDate = 'Please enter a valid expiry date';
    }
    
    if (!paymentData.cvv || paymentData.cvv.length < 3) {
      newErrors.cvv = 'CVV must be 3 digits';
    }
    
    if (!paymentData.cardName.trim()) {
      newErrors.cardName = 'Cardholder name is required';
    }
    
    if (!paymentData.email.trim()) {
      newErrors.email = 'Email is required';
    }
    
    if (!paymentData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!paymentData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
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
    
    try {
      // Simular procesamiento de pago
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Aquí iría la integración con el procesador de pagos real
      console.log('Processing payment for plan:', selectedPlan);
      console.log('Payment data:', paymentData);
      
      // Redirigir al registro con información de la suscripción
      navigate('/register', {
        state: {
          selectedPlan: selectedPlan,
          paymentData: {
            email: paymentData.email,
            firstName: paymentData.firstName,
            lastName: paymentData.lastName
          },
          subscriptionInfo: {
            planId: selectedPlan.id,
            planName: selectedPlan.name,
            price: selectedPlan.price,
            features: selectedPlan.features
          },
          message: `¡Pago exitoso! Complete su registro para activar su plan ${selectedPlan.name}`
        }
      });
      
    } catch (error) {
      console.error('Payment error:', error);
      setErrors({ general: 'Payment failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  if (!selectedPlan) {
    return null;
  }

  return (
    <div className="payment-page">
      <div className="payment-container">
        <div className="payment-header">
          <h1>Complete Your Purchase</h1>
          <p>You're subscribing to {selectedPlan.name} plan</p>
        </div>

        <div className="payment-content">
          <div className="payment-form-section">
            <form onSubmit={handleSubmit} className="payment-form">
              {errors.general && (
                <div className="error-message general-error">
                  {errors.general}
                </div>
              )}

              <div className="form-section">
                <h3>Personal Information</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="firstName">First Name</label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={paymentData.firstName}
                      onChange={handleInputChange}
                      className={`form-input ${errors.firstName ? 'error' : ''}`}
                      disabled={isLoading}
                    />
                    {errors.firstName && <span className="error-text">{errors.firstName}</span>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="lastName">Last Name</label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={paymentData.lastName}
                      onChange={handleInputChange}
                      className={`form-input ${errors.lastName ? 'error' : ''}`}
                      disabled={isLoading}
                    />
                    {errors.lastName && <span className="error-text">{errors.lastName}</span>}
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={paymentData.email}
                    onChange={handleInputChange}
                    className={`form-input ${errors.email ? 'error' : ''}`}
                    disabled={isLoading}
                  />
                  {errors.email && <span className="error-text">{errors.email}</span>}
                </div>
              </div>

              <div className="form-section">
                <h3>Payment Information</h3>
                <div className="form-group">
                  <label htmlFor="cardNumber">Card Number</label>
                  <input
                    type="text"
                    id="cardNumber"
                    name="cardNumber"
                    value={paymentData.cardNumber}
                    onChange={handleInputChange}
                    placeholder="1234 5678 9012 3456"
                    className={`form-input ${errors.cardNumber ? 'error' : ''}`}
                    disabled={isLoading}
                  />
                  {errors.cardNumber && <span className="error-text">{errors.cardNumber}</span>}
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="expiryDate">Expiry Date</label>
                    <input
                      type="text"
                      id="expiryDate"
                      name="expiryDate"
                      value={paymentData.expiryDate}
                      onChange={handleInputChange}
                      placeholder="MM/YY"
                      className={`form-input ${errors.expiryDate ? 'error' : ''}`}
                      disabled={isLoading}
                    />
                    {errors.expiryDate && <span className="error-text">{errors.expiryDate}</span>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="cvv">CVV</label>
                    <input
                      type="text"
                      id="cvv"
                      name="cvv"
                      value={paymentData.cvv}
                      onChange={handleInputChange}
                      placeholder="123"
                      className={`form-input ${errors.cvv ? 'error' : ''}`}
                      disabled={isLoading}
                    />
                    {errors.cvv && <span className="error-text">{errors.cvv}</span>}
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="cardName">Cardholder Name</label>
                  <input
                    type="text"
                    id="cardName"
                    name="cardName"
                    value={paymentData.cardName}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                    className={`form-input ${errors.cardName ? 'error' : ''}`}
                    disabled={isLoading}
                  />
                  {errors.cardName && <span className="error-text">{errors.cardName}</span>}
                </div>
              </div>

              <button
                type="submit"
                className="payment-submit-button"
                disabled={isLoading}
              >
                {isLoading ? 'Processing...' : `Pay $${selectedPlan.price}/month`}
              </button>
            </form>
          </div>

          <div className="order-summary">
            <h3>Order Summary</h3>
            <div className="summary-item">
              <span className="plan-name">{selectedPlan.name} Plan</span>
              <span className="plan-price">${selectedPlan.price}/month</span>
            </div>
            <div className="summary-divider"></div>
            <div className="summary-total">
              <span>Total</span>
              <span className="total-price">${selectedPlan.price}/month</span>
            </div>
            
            <div className="plan-features-summary">
              <h4>What's included:</h4>
              <ul>
                {selectedPlan.features.slice(0, 4).map((feature, index) => (
                  <li key={index}>✓ {feature}</li>
                ))}
                {selectedPlan.features.length > 4 && (
                  <li>+ {selectedPlan.features.length - 4} more features</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Payment; 