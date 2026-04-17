import React from 'react'
import { useState } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "./Profile.css";
function Profile() {

const navigate = useNavigate();
const [user,setUser] = useState(null);

useEffect(() => {
const storedUser = JSON.parse(localStorage.getItem("user"));
if (!storedUser) {
navigate("/login");
} else {
setUser(storedUser);
}
}, [navigate]);

const handleLogout = () => {
localStorage.removeItem("user");
alert("Logged out successfully");
navigate("/login");
};
if (!user) return null;

return (
<div className="profile-container">
<h1>Profile Page</h1>
<div className="profile-info">
<p>Name: {user?.name}</p>
<p>Email: {user?.email}</p>

</div>
<button className="back-btn" onClick={() => navigate("/")}>
Back to Home
</button>
<button className="logout-btn"onClick={handleLogout}>Logout</button>
</div>
)
}

export default Profile;