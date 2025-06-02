import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "./Subscription.css";

function Subscription() {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const plans = [
    {
      id: 'free',
      name: 'Gratis',
      price: 0,
      period: 'Siempre',
      description: 'Perfecto para empezar',
      features: [
        'Acceso a artículos gratuitos',
        'Newsletter básico',
        'Acceso a la comunidad',
        'Acceso desde móvil',
        'Soporte por email'
      ],
      buttonText: 'Comenzar Gratis',
      popular: false,
      color: '#6c757d'
    },
    {
      id: 'subscriber',
      name: 'Suscriptor',
      price: 9.99,
      period: 'por mes',
      description: 'Ideal para lectores regulares',
      features: [
        'Todo lo incluido en Gratis',
        'Acceso a artículos premium',
        'Experiencia sin anuncios',
        'Lectura offline',
        'Soporte prioritario',
        'Contenido exclusivo semanal',
        'Comentar en artículos'
      ],
      buttonText: 'Ser Suscriptor',
      popular: true,
      color: '#ffd700'
    },
    {
      id: 'author',
      name: 'Autor',
      price: 19.99,
      period: 'por mes',
      description: 'Para escritores y creadores',
      features: [
        'Todo lo incluido en Suscriptor',
        'Publicar artículos propios',
        'Panel de control de autor',
        'Estadísticas de artículos',
        'Interacción directa con lectores',
        'Webinars mensuales exclusivos',
        'Herramientas de escritura avanzadas'
      ],
      buttonText: 'Convertirse en Autor',
      popular: false,
      color: '#4CAF50'
    }
  ];

  const handlePlanSelect = async (plan) => {
    setSelectedPlan(plan.id);
    setIsLoading(true);

    try {
      if (plan.id === 'free') {
        // Para el plan gratuito, redirigir al registro
        if (isAuthenticated) {
          // Si ya está autenticado, redirigir al home
          navigate('/');
        } else {
          // Si no está autenticado, redirigir al registro
          navigate('/register', { 
            state: { 
              selectedPlan: 'free',
              message: 'Crea tu cuenta gratuita para comenzar' 
            } 
          });
        }
      } else {
        // Para planes de pago, redirigir a la página de pago
        navigate('/payment', { 
          state: { 
            selectedPlan: plan,
            returnUrl: '/subscription'
          } 
        });
      }
    } catch (error) {
      console.error('Error selecting plan:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="subscription-page">
      <div className="subscription-container">
        <div className="subscription-header">
          <h1>Choose Your Plan</h1>
          <p className="subscription-subtitle">
            Select the perfect plan for your reading needs
          </p>
        </div>

        <div className="plans-grid">
          {plans.map((plan) => (
            <div 
              key={plan.id} 
              className={`plan-card ${plan.popular ? 'popular' : ''} ${selectedPlan === plan.id ? 'selected' : ''}`}
            >
              {plan.popular && (
                <div className="popular-badge">Most Popular</div>
              )}
              
              <div className="plan-header">
                <h3 className="plan-name">{plan.name}</h3>
                <div className="plan-price">
                  <span className="price-amount">
                    {plan.price === 0 ? 'Gratis' : `$${plan.price}`}
                  </span>
                  {plan.price > 0 && (
                    <span className="price-period">/{plan.period.split(' ')[1] || plan.period}</span>
                  )}
                </div>
                <p className="plan-description">{plan.description}</p>
              </div>

              <div className="plan-features">
                <ul>
                  {plan.features.map((feature, index) => (
                    <li key={index}>
                      <span className="feature-check">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <button
                className={`plan-button ${plan.id}`}
                onClick={() => handlePlanSelect(plan)}
                disabled={isLoading && selectedPlan === plan.id}
              >
                {isLoading && selectedPlan === plan.id ? (
                  <span className="loading-spinner">Loading...</span>
                ) : (
                  plan.buttonText
                )}
              </button>
            </div>
          ))}
        </div>

        <div className="subscription-footer">
          <div className="guarantee">
            <h4>30-Day Money Back Guarantee</h4>
            <p>Not satisfied? Get a full refund within 30 days, no questions asked.</p>
          </div>
          
          <div className="faq-link">
            <p>
              Have questions? <a href="/faq">Check our FAQ</a> or{' '}
              <a href="/contact">contact support</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Subscription; 