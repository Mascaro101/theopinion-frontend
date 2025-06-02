import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import './SubscriptionSettings.css';

const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance with authentication
const createAuthAxios = () => {
  const instance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Add token to requests
  instance.interceptors.request.use(
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

  return instance;
};

function SubscriptionSettings() {
  const [currentSubscription, setCurrentSubscription] = useState(null);
  const [availablePlans, setAvailablePlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const fetchSubscriptionData = async () => {
    try {
      const api = createAuthAxios();

      // Fetch current subscription and available plans in parallel
      const [subscriptionResponse, plansResponse] = await Promise.all([
        api.get('/subscriptions/current'),
        api.get('/subscriptions/plans')
      ]);

      if (subscriptionResponse.data.success && plansResponse.data.success) {
        setCurrentSubscription(subscriptionResponse.data.data.subscription);
        setAvailablePlans(plansResponse.data.data.plans);
        setError(null);
      } else {
        throw new Error('Invalid response format from server');
      }
    } catch (err) {
      console.error('Error loading subscription information:', err);
      
      // Handle different types of errors
      let errorMessage = 'Error loading subscription information';
      
      if (err.response?.status === 401) {
        errorMessage = 'Authentication required. Please log in again.';
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchSubscriptionData();
    } else {
      setError('Please log in to view subscription information');
      setLoading(false);
    }
  }, [isAuthenticated]);

  const handleCancelSubscription = async () => {
    try {
      setLoading(true);
      const api = createAuthAxios();

      const response = await api.post('/subscriptions/cancel');

      if (response.data.success) {
        setCurrentSubscription(response.data.data.subscription);
        setError(null);
      } else {
        throw new Error(response.data.message || 'Error cancelling subscription');
      }
    } catch (err) {
      console.error('Error cancelling subscription:', err);
      
      let errorMessage = 'Error cancelling subscription';
      
      if (err.response?.status === 401) {
        errorMessage = 'Authentication required. Please log in again.';
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleUpgradeSubscription = (planId) => {
    navigate('/subscription', { 
      state: { 
        currentPlan: currentSubscription?.type,
        selectedPlan: planId 
      } 
    });
  };

  if (loading) {
    return <div className="subscription-settings-loading">Loading subscription information...</div>;
  }

  if (error) {
    return (
      <div className="subscription-settings-error">
        <p>{error}</p>
        <button 
          className="retry-button" 
          onClick={() => {
            setError(null);
            setLoading(true);
            fetchSubscriptionData();
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  const currentPlan = availablePlans.find(plan => plan.id === currentSubscription?.type);
  const higherPlans = availablePlans.filter(plan => 
    plan.price > (currentPlan?.price || 0) && plan.id !== currentPlan?.id
  );

  return (
    <div className="subscription-settings">
      <h2>Subscription Management</h2>
      
      <div className="current-subscription">
        <h3>Current Plan</h3>
        {currentPlan ? (
          <div className="plan-details">
            <h4>{currentPlan.name}</h4>
            <p className="price">
              {currentPlan.price === 0 ? 'Free' : `$${currentPlan.price}/month`}
            </p>
            <p className="status">
              Status: {currentSubscription.isActive ? 'Active' : 'Inactive'}
            </p>
            {currentSubscription.endDate && (
              <p className="end-date">
                Valid until: {new Date(currentSubscription.endDate).toLocaleDateString()}
              </p>
            )}
            {currentSubscription.isActive && currentPlan.id !== 'free' && (
              <button 
                className="cancel-button"
                onClick={handleCancelSubscription}
                disabled={loading}
              >
                Cancel Subscription
              </button>
            )}
          </div>
        ) : (
          <p>No active subscription</p>
        )}
      </div>

      {higherPlans.length > 0 && (
        <div className="upgrade-options">
          <h3>Available Upgrades</h3>
          <div className="plans-grid">
            {higherPlans.map(plan => (
              <div key={plan.id} className="upgrade-plan">
                <h4>{plan.name}</h4>
                <p className="price">${plan.price}/month</p>
                <ul className="features">
                  {plan.features.slice(0, 3).map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
                <button
                  className="upgrade-button"
                  onClick={() => handleUpgradeSubscription(plan.id)}
                  disabled={loading}
                >
                  Upgrade to {plan.name}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default SubscriptionSettings; 