import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import SubscriptionSettings from './SubscriptionSettings';
import './Settings.css';

function Settings() {
  const [activeTab, setActiveTab] = useState('profile');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Extraer el tab de la URL (ejemplo: /settings/subscription -> subscription)
    const tab = location.pathname.split('/').pop();
    if (['profile', 'subscription', 'notifications', 'security'].includes(tab)) {
      setActiveTab(tab);
    }
  }, [location]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    navigate(`/settings/${tab}`);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'subscription':
        return <SubscriptionSettings />;
      case 'profile':
        return <div className="settings-section">Profile settings coming soon...</div>;
      case 'notifications':
        return <div className="settings-section">Notification settings coming soon...</div>;
      case 'security':
        return <div className="settings-section">Security settings coming soon...</div>;
      default:
        return <div className="settings-section">Select a tab to view settings</div>;
    }
  };

  return (
    <div className="settings-page">
      <div className="settings-container">
        <div className="settings-sidebar">
          <h2>Settings</h2>
          <nav className="settings-nav">
            <button
              className={`nav-button ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => handleTabChange('profile')}
            >
              Profile
            </button>
            <button
              className={`nav-button ${activeTab === 'subscription' ? 'active' : ''}`}
              onClick={() => handleTabChange('subscription')}
            >
              Subscription
            </button>
            <button
              className={`nav-button ${activeTab === 'notifications' ? 'active' : ''}`}
              onClick={() => handleTabChange('notifications')}
            >
              Notifications
            </button>
            <button
              className={`nav-button ${activeTab === 'security' ? 'active' : ''}`}
              onClick={() => handleTabChange('security')}
            >
              Security
            </button>
          </nav>
        </div>
        
        <div className="settings-content">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}

export default Settings; 