import React, { useEffect, useState } from "react";
import "./Cart.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Cart() {
const [cart, setCart] = useState([]);
const navigate = useNavigate();
const fetchCart = async () => {

try {
const user = JSON.parse(localStorage.getItem("user"));
if (!user) return;
const res = await axios.get(`http://localhost:5000/cart?email=${user.email}`);
setCart(Array.isArray(res.data) ? res.data : []);
} catch (err) {
      console.error(err);
      setCart([]);
}
};
useEffect(() => {
const user = localStorage.getItem("user");
if (!user) {
alert("Please login first");
navigate("/login");
return;
}
fetchCart();
}, []);

const removeItem = async (id) => {
try {
const user = JSON.parse(localStorage.getItem("user"));
await axios.delete(`http://localhost:5000/cart/${id}?email=${user.email}`);
fetchCart();
} catch (err) {
console.error(err);
}
};

const increaseQty = async (item) => {
try {
const user = JSON.parse(localStorage.getItem("user"));
await axios.put(`http://localhost:5000/cart/${item._id}?email=${user.email}`,{ quantity: item.quantity + 1 });
fetchCart();
} catch (err) {
console.error(err);
}
};

const decreaseQty = async (item) => {
if (item.quantity <= 1) return;
try {
const user = JSON.parse(localStorage.getItem("user"));
await axios.put(`http://localhost:5000/cart/${item._id}?email=${user.email}`,{ quantity: item.quantity - 1 });
fetchCart();
} catch (err) {
    console.error(err);
}
};

const totalPrice = cart.reduce(
(total, item) =>
total + (item.productId?.price || 0) * item.quantity,0
);

return (
<div className="cartpage">
<h2 className="carttitle">Your Cart</h2>
{cart.length === 0 ? (
<p className="empty">Your cart is empty</p>
) : (
<>
<div className="cartcontainer">
{cart.map((item) => (
<div className="cartcard" key={item._id}>
<img src={`http://localhost:5000/uploads/${item.productId?.imageUpload}`}alt={item.productId?.title}/>

<div className="cartdetails">
<h3>{item.productId?.title}</h3>
<p>Price: {item.productId?.price}</p>
<div className="qty">
<button onClick={() => decreaseQty(item)}>-</button>
<span>{item.quantity}</span>
<button onClick={() => increaseQty(item)}>+</button>
</div>

<button className="removebtn" onClick={() => removeItem(item._id)}>Remove</button>
</div>
</div>
))}
</div>
<div className="carttotal">
<h3>SubTotal Rs: {totalPrice}</h3>
</div>
<button onClick={() => navigate("/checkout")}>Checkout</button>
</>
)}
</div>
);
}

export default Cart;