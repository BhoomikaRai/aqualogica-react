import "./login.css";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

function Login() {
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const navigate = useNavigate();

const handleSubmit = (e) => {
e.preventDefault();
if (email === "admin@gmail.com" && password === "admin") {
localStorage.setItem("user",JSON.stringify({email,isAdmin: true,}));
navigate("/dashboard");
return;
}

axios.post("https://aqualogica-react-backend.onrender.com/login", { email, password })
.then((result) => {
console.log(result);
if (result.data === "Success") {
localStorage.setItem("user",JSON.stringify({email,isAdmin: false,}));
navigate("/");
} else {
alert("Invalid credentials");
}
})
.catch((err) => console.log(err));
};

return (
<div className="container">
<div className="left">
<h1 className="logo">Aqualogica</h1>
<p className="brand">A Honasa Consumer Brand</p>
<h2 className="welcome">
Welcome! Register to avail the best deals!
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
<h2>Login to Your Account</h2>
<form onSubmit={handleSubmit}>
<div className="input-box">
<input type="email"placeholder="Enter Email"value={email}onChange={(e) => setEmail(e.target.value)}required/>
</div>

<div className="input-box">
<input type="password"placeholder="Enter Password"value={password}onChange={(e) => setPassword(e.target.value)}required/>
</div>
<button type="submit">Login</button>
</form>
<p className="switch">
Don't have an account? <Link to="/signup">Sign Up</Link>
</p>
</div>
</div>
);
}

export default Login;
