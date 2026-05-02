import React, { useState, useEffect } from "react";
import axios from "axios";
import "./OrderHistory.css";

function OrderHistory() {

const [orders, setOrders] = useState([]);
const user = JSON.parse(localStorage.getItem("user"));

useEffect(() => {
if (!user) return;
axios.get(`http://localhost:5000/order?email=${user.email}`)
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
<table>
<thead>
<tr>
<th>Order ID</th>
<th>Image</th>
<th>Product</th>
<th>Price × Qty</th>
<th>Status</th>
<th>Total (₹)</th>
<th>Date</th>
</tr>
</thead>

<tbody>
{orders.map((order) =>
order.products.map((p, i) => {
const product = p.productId;
return (
<tr key={order._id + i}>

<td>{order._id}</td>
<td>
<img src={product?.imageUpload}alt={product?.title}className="product-img"
/>
</td>

<td>{product?.title || "Product"}</td>
<td>
Rs {product?.price || 0} * {p.quantity} = Rs {(product?.price || 0) * p.quantity}
</td>
<td>{order.status}</td>

<td>₹{order.totalAmount.toFixed(2)}</td>

<td>{new Date(order.createdAt).toLocaleDateString()}</td>
</tr>
);
})
)}
</tbody>
</table>
)}
</div>
);
}

export default OrderHistory;