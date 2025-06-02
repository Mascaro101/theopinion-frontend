import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "./NavBar.css";

function NavBar() {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate("/");
  };

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };

  const getSubscriptionBadge = () => {
    if (!user?.subscription) return null;
    
    const { type } = user.subscription;
    if (type === 'free') return null;
    
    return (
      <span className={`subscription-badge ${type}`}>
        {type.toUpperCase()}
      </span>
    );
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">Revista Online</Link>
        
        <div className="search-container">
          <input type="text" placeholder="Search articles..." className="search-input" />
        </div>
        
        <div className="navbar-buttons">
          {isAuthenticated ? (
            <div className="user-section">
              <div className="user-info" onClick={toggleUserMenu}>
                <div className="user-avatar">
                  {user?.profile?.avatar ? (
                    <img src={user.profile.avatar} alt="Avatar" />
                  ) : (
                    <span className="avatar-initials">
                      {user?.firstName?.[0]}{user?.lastName?.[0]}
                    </span>
                  )}
                </div>
                <div className="user-details">
                  <span className="user-name">
                    {user?.firstName} {user?.lastName}
                  </span>
                  {getSubscriptionBadge()}
                </div>
                <span className="dropdown-arrow">▼</span>
              </div>
              
              {showUserMenu && (
                <div className="user-menu">
                  <div className="user-menu-header">
                    <p className="user-email">{user?.email}</p>
                    <p className="user-role">{user?.role}</p>
                  </div>
                  <div className="user-menu-divider"></div>
                  <Link to="/profile" className="user-menu-item" onClick={() => setShowUserMenu(false)}>
                    Mi Perfil
                  </Link>
                  <Link to="/settings/subscription" className="user-menu-item" onClick={() => setShowUserMenu(false)}>
                    Configuración
                  </Link>
                  {user?.role === 'admin' && (
                    <Link to="/admin" className="user-menu-item" onClick={() => setShowUserMenu(false)}>
                      Panel Admin
                    </Link>
                  )}
                  {(user?.role === 'author' || user?.role === 'editor' || user?.role === 'admin') && (
                    <Link to="/dashboard" className="user-menu-item" onClick={() => setShowUserMenu(false)}>
                      Dashboard
                    </Link>
                  )}
                  <div className="user-menu-divider"></div>
                  <button className="user-menu-item logout-item" onClick={handleLogout}>
                    Cerrar Sesión
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" className="login-button">Log in</Link>
              <Link to="/subscription" className="subscribe-button">Subscribe</Link>
            </>
          )}
        </div>
      </div>
      
      {/* Overlay para cerrar el menú al hacer clic fuera */}
      {showUserMenu && (
        <div className="menu-overlay" onClick={() => setShowUserMenu(false)}></div>
      )}
    </nav>
  );
}

export default NavBar;
