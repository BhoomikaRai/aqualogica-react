
import React, { useEffect, useState } from "react";
import "./Dashboard.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid,
BarChart, Bar,
PieChart, Pie, Cell, Legend
} from "recharts";

function Dashboard() {
const [orders, setOrders] = useState([]);
const [users, setUsers] = useState([]);
const navigate = useNavigate();

useEffect(() => {
fetchData();
}, []);

const fetchData = async () => {
try {
const orderRes = await axios.get(`${import.meta.env.VITE_API_URL}/order`);
const userRes = await axios.get(`${import.meta.env.VITE_API_URL}/users`);
setOrders(orderRes.data);
setUsers(userRes.data);
} catch (err) {
console.log(err);
}
};

const handleLogout = () => {
localStorage.removeItem("user");
navigate("/login", { replace: true });
};

const totalSales = orders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
const totalOrders = orders.length;
const totalUsers = users.length;

const groupByDate = (data, isUser = false) => {
const map = {};
data.forEach((item) => {
if (!item.createdAt) return;
const date = new Date(item.createdAt).toLocaleDateString();
if (isUser) {
map[date] = (map[date] || 0) + 1;
} else {
map[date] = (map[date] || 0) + (item.totalAmount || 0);
}
});
return Object.keys(map).map((date) => ({
date,
amount: map[date]
}));
};

const salesData = groupByDate(orders);
const signupData = groupByDate(users, true);

const statusCount = {
Pending: 0,
Shipped: 0,
Delivered: 0,
};

orders.forEach((order) => {
const status = order.status || "Pending";
if (statusCount[status] !== undefined) {
statusCount[status]++;
}
});

const statusData = [
{ name: "Pending", value: statusCount.Pending },
{ name: "Shipped", value: statusCount.Shipped },
{ name: "Delivered", value: statusCount.Delivered },
];
const COLORS = ["#FFA500", "#0088FE", "#00C49F"];

return (
<div className="dashboard">
<div className="dashboard-header">
<h1 className="dashboard-title">Admin Dashboard</h1>
<button className="logout-btn" onClick={handleLogout}>Logout</button>
</div>

<div className="dashboard-buttons">
<Link to="/admin" className="btn">Add Product</Link>
<Link to="/products" className="btn">Manage Product</Link>
<Link to="/order" className="btn">Manage Order</Link>
</div>

<div className="cards">
<div className="card">Total Sales ₹{totalSales}</div>
<div className="card">Total Payments ₹{totalSales}</div>
<div className="card">Total Users {totalUsers}</div>
<div className="card">Total Orders {totalOrders}</div>
</div>

<div className="charts">
<div>
<h3>Sales Trend</h3>
<LineChart width={400} height={250} data={salesData}>
<XAxis dataKey="date" />
<YAxis />
<Tooltip />
<CartesianGrid stroke="#ccc" />
<Line type="monotone" dataKey="amount" stroke="blue" />
</LineChart>
</div>

<div>
<h3>Orders Overview</h3>
<BarChart width={400} height={250} data={salesData}>
<XAxis dataKey="date" />
<YAxis />
<Tooltip />
<Bar dataKey="amount" fill="green" />
</BarChart>
</div>

<div>
<h3>Signup Growth</h3>
<LineChart width={400} height={250} data={signupData}>
<XAxis dataKey="date" />
<YAxis />
<Tooltip />
<Line dataKey="amount" stroke="purple" strokeWidth={3} />
</LineChart>
</div>

<div>
<h3>Order Status</h3>
<PieChart width={400} height={250}>
<Pie data={statusData}
dataKey="value"
nameKey="name"
innerRadius={50}
outerRadius={80}
label={({ name, value }) => `${name} (${value})`}
>
{statusData.map((entry, index) => (
<Cell key={index} fill={COLORS[index % COLORS.length]} />
))}
</Pie>
<Legend />
</PieChart>
</div>

</div>
</div>
  );
}

export default Dashboard;




