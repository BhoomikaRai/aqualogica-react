import React from 'react'
import { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import "./OrderHistory.css";

function OrderHistory() {

const [orders, setOrders] = useState([]);
const user = JSON.parse(localStorage.getItem("user"));

useEffect(() => {
if (!user) return;
axios.get(`https://aqualogica-react-backend.onrender.com/order?email=${user.email}`)
.then((response) => {
    setOrders(response.data);
})
.catch((error) => {
console.error("Error fetching orders:", error);
});
}, [user]);

return (
<div className="order-history">
<h1>Your Orders</h1>
{orders.length === 0 ? (
<p>No orders found.</p>
) : (
orders.map((order) => (
<div className="order-item" key={order._id}>
<p>Order ID: {order._id}</p>
<p>Status: {order.status}</p>
<p>Total: {order.totalAmount}</p>
</div>
))
)}
</div>
)
}

export default OrderHistory
