import React from 'react'
import "./Dashboard.css"
import { Link } from 'react-router-dom';
function Dashboard() {
return (
<div className="dashboard">
<h1 className="dashboard-title">ADMIN DASHBOARD</h1>
<p className="dashboard-sub">Welcome to the admin dashboard!</p>
<div className="dashboard-buttons">
<div><Link to="/admin" className="btn">Add Product</Link></div>
<div><Link to="/products" className="btn">Manage Products</Link></div>
<div><Link to="/order" className="btn">Manage Orders</Link></div>
</div>
</div>
  );
}

export default Dashboard