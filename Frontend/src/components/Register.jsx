import "./login.css";  
import { Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import {useNavigate}from "react-router-dom";
function Register() {
const [name, setName] = useState("");
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const navigate = useNavigate();
const handleSubmit = (e) => {
e.preventDefault();
axios.post('http://localhost:5000/register',{name,email,password})
.then(result => {
console.log(result);
navigate("/login");
})
.catch(err => console.log(err))
 }
return (
<div className="container">
<div className="left">
<h1 className="logo">Aqualogica</h1>
<p className="brand">A Honasa Consumer Brand</p>
<h2 className="welcome">Join us and unlock superior discounts!
</h2>
<div className="cards">
<div className="card">
<h3>Zero Subscription Fees</h3>
<p>Access KwikPass without any subscription charges</p>
</div>
<div className="card">
<h3>Lowest price guaranteed</h3>
<p>Explore unbeatable prices and unmatched value</p>
</div>
<div className="card">
<h3>100% secure & spam free</h3>
<p>Guaranteed data protection & spam-free inbox</p>
</div>
</div>
</div>
<div className="right">
<h2>Create Your Account</h2>
<form onSubmit={handleSubmit}>
<div className="input-box">
<input type="text" placeholder="Full Name"  onChange={(e)=>setName(e.target.value)} required />
</div>
<div className="input-box">
<input type="email" placeholder="Enter Email" onChange={(e)=>setEmail(e.target.value)} required />
</div>
<div className="input-box">
<input type="password" placeholder="Create Password" onChange={(e)=>setPassword(e.target.value)} required />
</div>

<button type="submit">Sign Up</button>
</form>
<p className="switch">Already have an account? <Link to="/login">Login</Link></p>
</div>
</div>
  );
}
export default Register;
