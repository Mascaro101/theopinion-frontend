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
        "https://theopinion-backend-1.onrender.com/users/changePermission",
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
      <h2>Mock Payment</h2>
      <form className="mock-payment-form" onSubmit={handleFakeSubmit}>
        <label>Card Number:</label>
        <input
          type="text"
          value={cardNumber}
          onChange={(e) => setCardNumber(e.target.value)}
          required
        />

        <label>Cardholder Name:</label>
        <input
          type="text"
          value={cardName}
          onChange={(e) => setCardName(e.target.value)}
          required
        />

        <button type="submit">Pay and Upgrade</button>
      </form>
    </div>
  );
}

export default MockPayment;
