import React, { useEffect, useState } from "react";
import "./Dashboard.css";
import axios from "axios";

import AddProduct from "./Admin";
import ManageProduct from "./ManageProduct";
import ManageOrder from "./ManageOrder";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";

function Dashboard() {

const [activePage, setActivePage] = useState("dashboard");

const [orders, setOrders] = useState([]);

const [users, setUsers] = useState([]);

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
window.location.href = "/login";
};

const totalSales = orders.reduce(
(sum, o) => sum + (o.totalAmount || 0),0);

const totalOrders = orders.length;
const totalUsers = users.length;

const groupByDate = (data, isUser = false) => {
const map = {};
data.forEach((item) => {
if (!item.createdAt) return;
const date = new Date(
item.createdAt
).toLocaleDateString();
if (isUser) {
map[date] = (map[date] || 0) + 1;
} else {
map[date] =
(map[date] || 0) + (item.totalAmount || 0);
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
    Delivered: 0
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
{ name: "Delivered", value: statusCount.Delivered }
];
const COLORS = ["red", "blue", "green"];

return (
<div className="admin-layout">

<div className="sidebar">
<h2>Admin Panel</h2>
<button onClick={() => setActivePage("dashboard")}>Dashboard</button>
<button onClick={() => setActivePage("add")}>Add Product
</button>
<button onClick={() => setActivePage("manage")}>Manage Product</button>
<button onClick={() => setActivePage("orders")}>Manage Orders</button>
<button className="logout-btn"onClick={handleLogout}>Logout</button>
</div>

<div className="dashboard">
{activePage === "dashboard" && (
<>
<div className="dashboard-header">
<h1 className="dashboard-title">Admin Dashboard </h1>
</div>

<div className="cards">
<div className="card">
Total Sales ₹{totalSales}
</div>
<div className="card">
Total Payments ₹{totalSales}
</div>

<div className="card">
Total Users {totalUsers}
</div>

<div className="card">
Total Orders {totalOrders}
</div>
</div>

<div className="charts">
<div>
<h3>Sales Trend</h3>
<LineChart width={400}height={250}data={salesData}>
<XAxis dataKey="date" />
<YAxis />
<Tooltip />
<CartesianGrid stroke="grey" />
<Line type="monotone" dataKey="amount"stroke="blue" />
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

<LineChart  width={400} height={250} data={signupData} >
<XAxis dataKey="date" />
<YAxis />
<Tooltip />
<Line dataKey="amount" stroke="purple"strokeWidth={3} />
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
label={({ name, value }) =>
 `${name} (${value})`
}
>
{statusData.map((entry, index) => (
<Cell key={index} fill={COLORS[index % COLORS.length]} />
))}
</Pie>
<Legend />
 </PieChart>
 </div>
</div>
</>
)}
{activePage === "add" && <AddProduct />}
 {activePage === "manage" && <ManageProduct />}
{activePage === "orders" && <ManageOrder />}
 </div>
</div>
  );
}

export default Dashboard;