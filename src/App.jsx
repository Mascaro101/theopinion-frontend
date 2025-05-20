import React from "react";
import NavBar from "./NavBar/NavBar.jsx";
import "./App.css";

function App() {
  return (
    <div className="App">
      <NavBar />
      <main className="main-content">
        <h1>Welcome to The Daily Times</h1>
        <p>Your source for reliable news and thoughtful journalism.</p>
      </main>
    </div>
  );
}

export default App;
