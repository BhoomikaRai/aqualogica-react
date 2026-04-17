import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Payment.css";

function Payment() {
const navigate = useNavigate();
const [method, setMethod] = useState("COD");
const [cart, setCart] = useState([]);
const [upiId, setUpiId] = useState("");
const address = JSON.parse(localStorage.getItem("address"));
useEffect(() => {
const user = JSON.parse(localStorage.getItem("user"));
if (!user) {
alert("Please login first");
navigate("/login");
return;
}
axios.get(`https://aqualogica-react-backend.onrender.com/cart?email=${user.email}`)
.then((res) => setCart(res.data))
.catch((err) => console.log(err));
}, []);

const handleOrder = async () => {
try {
const user = JSON.parse(localStorage.getItem("user"));
const products = cart.map((item) => ({
productId: item.productId._id,
quantity: item.quantity,
}));
const totalAmount = cart.reduce(
(acc, item) => acc + item.productId.price * item.quantity,0);

if (method === "COD") {
await axios.post("https://aqualogica-react-backend.onrender.com/order", {
products,
totalAmount,
address,
paymentMethod: "COD",
email: user.email,
});
alert("Order placed with COD");
localStorage.removeItem("address");
navigate("/");
return;
}

if (method === "UPI") {
await axios.post("https://aqualogica-react-backend.onrender.com/order", {
products,
totalAmount,
address,
paymentMethod: "UPI",
upiId,
email: user.email,
});
alert("Order placed with UPI");
localStorage.removeItem("address");
navigate("/");
return;
}

if (method === "ONLINE") {
const { data } = await axios.post(
"http://localhost:5000/create-order",
{ amount: totalAmount });

const options = {
key: process.env.REACT_APP_RAZORPAY_KEY_ID, 
amount: data.amount,
currency: data.currency,
name: "My Store",
description: "Order Payment",
order_id: data.id,


handler: async function (response) {
try {
const verifyRes = await axios.post(
"http://localhost:5000/verify-payment",
{
razorpay_order_id: data.id,
razorpay_payment_id: response.razorpay_payment_id,
razorpay_signature: response.razorpay_signature,
}
);

if (verifyRes.data.success) {
await axios.post("https://aqualogica-react-backend.onrender.com/order", {
products,
totalAmount,
address,
paymentMethod: "ONLINE",
paymentId: response.razorpay_payment_id,
email: user.email,
});
alert("Payment Verified and Order Placed ");
localStorage.removeItem("address");
navigate("/");
} else {
alert("Payment verification failed ");
}
} catch (err) {
console.log(err);
alert("Error verifying payment");
}
},
};

const razor = new window.Razorpay(options);
razor.open();
}
} catch (err) {
console.log(err);
alert("Something went wrong");
}
};

return (
<div className="paymentpage">
<div className="paymentbox">

<h2>Payment</h2>
<h3>Delivery Address</h3>
<p>{address?.name}</p>
<p>{address?.house}, {address?.area}</p>
<p>{address?.city}, {address?.state}</p>
<p>{address?.pincode}</p>
<p>{address?.phone}</p>

<h3>Select Payment Method</h3>

<label>
<input type="radio" value="COD"checked={method === "COD"}onChange={(e) => setMethod(e.target.value)}/>
Cash on Delivery
</label>

<label>
<input type="radio"value="UPI"checked={method === "UPI"}onChange={(e) => setMethod(e.target.value)}/>
UPI
</label>

{method === "UPI" && (
<input className="upiinput" type="text" placeholder="Enter UPI ID" value={upiId} onChange={(e) => setUpiId(e.target.value)} /> )}

<label>
<input type="radio" value="ONLINE" checked={method === "ONLINE"} onChange={(e) => setMethod(e.target.value)} />
Online Payment
</label>
<button className="placebtn" onClick={handleOrder}>Place Order</button>
</div>
</div>
);
}

export default Payment;
