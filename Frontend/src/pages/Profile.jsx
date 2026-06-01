import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Profile.css";

function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (!storedUser) {
      navigate("/login");
    } else {
      setUser(storedUser);

      axios
        .get(
          `${import.meta.env.VITE_API_URL}/order?email=${storedUser.email}`
        )
        .then((res) => setOrders(res.data))
        .catch((err) => console.log(err));
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    alert("Logged out successfully");
    navigate("/login");
  };

  if (!user) return null;

  const totalOrders = orders.length;

  const pendingOrders = orders.filter(
    (order) => order.status === "Pending"
  ).length;

  const deliveredOrders = orders.filter(
    (order) => order.status === "Delivered"
  ).length;

  return (
    <div className="profile-container">
      <h1>My Profile</h1>

      <div className="profile-info">
        <div className="profile-avatar">
          {user?.name?.charAt(0).toUpperCase()}
        </div>

        <p>
          <strong>Name:</strong> {user?.name}
        </p>

        <p>
          <strong>Email:</strong> {user?.email}
        </p>

        <div className="stats">
          <div className="stat-box">
            <h3>{totalOrders}</h3>
            <span>Total Orders</span>
          </div>

          <div className="stat-box">
            <h3>{pendingOrders}</h3>
            <span>Pending</span>
          </div>

          <div className="stat-box">
            <h3>{deliveredOrders}</h3>
            <span>Delivered</span>
          </div>
        </div>
      </div>

      <div className="profile-buttons">
        <button
          className="orders-btn"
          onClick={() => navigate("/order-history")}
        >
          📦 View Orders
        </button>

        <button
          className="back-btn"
          onClick={() => navigate("/")}
        >
          🏠 Back to Home
        </button>

        <button
          className="logout-btn"
          onClick={handleLogout}
        >
          🚪 Logout
        </button>
      </div>
    </div>
  );
}

export default Profile;