import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./MockPayment.css";

function MockPayment() {
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const navigate = useNavigate();

  const handleFakeSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      const response = await axios.patch(
        "https://theopinion-backend-1.onrender.com/api/users/changePermission",
        { permission: 1 },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data?.token) {
        localStorage.setItem("token", response.data.token);
      }
      alert("Mock payment processed. Permission upgraded.");
      navigate("/");
    } catch (err) {
      alert("Failed to upgrade permission.");
    }
  };

  return (
    <div className="mock-payment-container">
      <h2>Pago</h2>
      <form className="mock-payment-form" onSubmit={handleFakeSubmit}>
        <label>Numero de Tarjeta:</label>
        <input
          type="text"
          value={cardNumber}
          onChange={(e) => setCardNumber(e.target.value)}
          required
        />

        <label>Nombre:</label>
        <input
          type="text"
          value={cardName}
          onChange={(e) => setCardName(e.target.value)}
          required
        />

        <button type="submit">Pagar y Suscribirte</button>
      </form>
    </div>
  );
}

export default MockPayment;
