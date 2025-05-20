import React from "react";
import "./NavBar.css";

function NavBar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <a href="/" className="navbar-logo">The Daily Times</a>
        <ul className="navbar-links">
          <li><a href="/Home">Home</a></li>
          <li><a href="/Articles1">Articles1</a></li>
          <li><a href="/Articles2">Articles2</a></li>
          <li><a href="/Articles3">Articles3</a></li>
        </ul>
      </div>
    </nav>
  );
}

export default NavBar;
