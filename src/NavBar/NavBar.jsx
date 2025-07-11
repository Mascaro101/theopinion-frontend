import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "./NavBar.css";

function NavBar() {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const inactivityTimer = useRef(null);

  // Function to reset the inactivity timer
  const resetInactivityTimer = () => {
    if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
    inactivityTimer.current = setTimeout(() => {
      if (isAuthenticated) {
        handleLogout();
        alert("You have been logged out due to inactivity.");
      }
    }, 30000); // 30 seconds
  };

  useEffect(() => {
    if (!isAuthenticated) return;

    // List of events that indicate user activity
    const events = ["mousemove", "keydown", "mousedown", "touchstart"];
    events.forEach(event =>
      window.addEventListener(event, resetInactivityTimer)
    );

    // Start the timer when component mounts or user logs in
    resetInactivityTimer();

    // Cleanup
    return () => {
      events.forEach(event =>
        window.removeEventListener(event, resetInactivityTimer)
      );
      if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
    };
    // eslint-disable-next-line
  }, [isAuthenticated]);

  const handleLogout = async () => {
  try {
    await logout();
    setShowUserMenu(false);

    // Verificación técnica
    const token = localStorage.getItem("token");
    const userStored = localStorage.getItem("user");

    if (!token && !userStored) {
      console.log("✅ Logout verificado: localStorage limpio.");
    } else {
      console.warn("⚠️ Logout incompleto: localStorage aún tiene datos.");
    }

    // Emitir evento global
    const logoutEvent = new CustomEvent("userLoggedOut");
    window.dispatchEvent(logoutEvent);
    console.log("📢 Evento 'userLoggedOut' emitido globalmente.");

    // Redirección a la página de inicio
    navigate("/", { replace: true });

    setTimeout(() => {
      if (window.location.pathname === "/") {
        console.log("✅ Redirección exitosa a / tras logout.");
      } else {
        console.error("❌ Fallo en redirección tras logout.");
      }
    }, 200);
  } catch (error) {
    console.error("❌ Error durante logout:", error);
  }
};

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };

  const getSubscriptionBadge = () => {
    if (!user?.subscription) return null;
    const { type } = user.subscription;
    if (type === "free") return null;

    return (
      <span className={`subscription-badge ${type}`}>
        {type.toUpperCase()}
      </span>
    );
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">The Opinion</Link>

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

                  {user?.role === "admin" && (
                    <Link to="/admin" className="user-menu-item" onClick={() => setShowUserMenu(false)}>Panel Admin</Link>
                  )}

                  {["author", "editor", "admin"].includes(user?.role) && (
                    <Link to="/dashboard" className="user-menu-item" onClick={() => setShowUserMenu(false)}>Dashboard</Link>
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
            </>
          )}
        </div>
      </div>

      {showUserMenu && (
        <div className="menu-overlay" onClick={() => setShowUserMenu(false)}></div>
      )}
    </nav>
  );
}

export default NavBar;