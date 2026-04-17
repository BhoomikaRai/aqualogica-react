import React, { useState, useEffect } from "react";
import "./Checkout.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Checkout() {
const navigate = useNavigate();
const [cart, setCart] = useState([]);
const [totalPrice, setTotalPrice] = useState(0);
const [address, setAddress] = useState({
  pincode: "",
  city: "",
  state: "",
  house: "",
  area: "",
  name: "",
  email: "",
  phone: "",
});
useEffect(() => {
const user = JSON.parse(localStorage.getItem("user"));
if (!user) {
  alert("Please login first");
  navigate("/login");
  return;
}
axios.get(`http://localhost:5000/cart?email=${user.email}`)
.then((res) => {
setCart(res.data);
const total = res.data.reduce(
(acc, item) =>
acc + (item.productId?.price || 0) * item.quantity,0);
setTotalPrice(total);
})
.catch((err) => console.log(err));
}, []);

const handleChange = (e) => {
  setAddress({ ...address, [e.target.name]: e.target.value });
};

const handleSubmit = (e) => {
e.preventDefault();
localStorage.setItem("address", JSON.stringify(address));
navigate("/payment");
};

return (
<div className="checkoutcontainer">
<div className="checkout">

<h2>Add Delivery Address</h2>
<form onSubmit={handleSubmit}>
<input type="text" name="pincode" placeholder="Pincode" onChange={handleChange} required />
<div className="row">
<input type="text" name="city" placeholder="City" onChange={handleChange} required />
<input type="text" name="state" placeholder="State" onChange={handleChange} required />
</div>
<input type="text" name="house" placeholder="Flat, House no." onChange={handleChange} required />
<input type="text" name="area" placeholder="Area, Village" onChange={handleChange} required />

<h3>Customer Information</h3>
<input type="text" name="name" placeholder="Full Name" onChange={handleChange} required />
<input type="email" name="email" placeholder="Email Address" onChange={handleChange} required />
<input type="text" name="phone" placeholder="Phone Number" onChange={handleChange} required />
<button type="submit">Proceed to Payment</button>
</form>
</div>

<div className="ordersummary">
<h3>Order Summary</h3>
{cart.length === 0 ? (
<p>No items in cart</p>
) : (
cart.map((item) => (
<div key={item._id} className="summaryitem">
<p>{item.productId?.title}</p>
<p>
₹{item.productId?.price} × {item.quantity}
</p>
</div>
))
)}
<hr />
<h2>Total:Rs{totalPrice}</h2>
</div>
</div>
);
}

export default Checkout;