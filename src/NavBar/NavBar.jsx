import React from "react";
import { Link } from "react-router-dom";
import "./NavBar.css";

function NavBar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <a href="/" className="navbar-logo">Revista Online</a>
        
        <div className="search-container">
          <input type="text" placeholder="Search articles..." className="search-input" />
        </div>
        
        <div className="navbar-buttons">
          <Link to="/login" className="login-button">Log in</Link>
          <button className="subscribe-button">Subscribe</button>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
