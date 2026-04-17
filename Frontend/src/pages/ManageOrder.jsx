import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ManageOrder.css";

function ManageOrder() {
const [orders, setOrders] = useState([]);

const fetchOrders = () => {
axios.get("http://localhost:5000/order")
     .then((res) => setOrders(res.data))
     .catch((err) => console.log(err));
};

useEffect(() => {
fetchOrders();
}, []);

const deleteOrder = async (id) => {
try {
await axios.delete(`https://aqualogica-react-backend.onrender.com/order/${id}`);
fetchOrders();
} catch (err) {
console.error(err);
}
};

const updateStatus = async (id, status) => {
try {
await axios.put(`https://aqualogica-react-backend.onrender.com/order/${id}`,{ status });
fetchOrders();
} catch (err) {
console.error(err);
}
};

return (
<div className="manageorders">
<h2>Manage Orders</h2>
<table>
<thead>
<tr>
<th>Order ID</th>
<th>Products</th>
<th>Total</th>
<th>Address</th>
<th>Payment</th>
<th>Status</th>
<th>Actions</th>
</tr>
</thead>
<tbody>
{orders.length === 0 ? (
<tr>
<td colSpan="7">No Orders Found</td>
</tr>
) : (
orders.map((order) => (
<tr key={order._id}>
<td>{order._id}</td>
<td>
{order.products.map((p, i) => (
<div key={i}>
{p.productId?.title} {p.quantity}
</div>
))}
</td>

<td>{order.totalAmount}</td>

<td>
{order.address?.name} <br />
{order.address?.city}
</td>

<td>{order.paymentMethod}</td>

<td>
<select value={order.status}onChange={(e) =>updateStatus(order._id, e.target.value)}>
<option value="Pending">Pending</option>
<option value="Shipped">Shipped</option>
<option value="Delivered">Delivered</option>
</select>
</td>

<td>
<button onClick={() => deleteOrder(order._id)}>Delete</button>
</td>
</tr>
))
)}
</tbody>
</table>
</div>
);
}

export default ManageOrder;
