import React from 'react'
import { useState,useEffect } from "react";
import axios from "axios";
import { useParams,useNavigate } from 'react-router-dom';
import "./ProDetails.css";

function ProDetails() {
const {id}=useParams();
const navigate=useNavigate();
const[product,setProduct]=useState({})
const [qty,setQty]=useState(1);


useEffect(()=>{
axios.get(`http://localhost:5000/addproduct/${id}`)
.then(res=>setProduct(res.data))
.catch(err=>console.log(err));
},[id]);
const increaseQty = () => {
setQty(qty + 1);
};
const decreaseQty = () => {
if(qty > 1){
setQty(qty - 1);
}
};
const [myProduct,setMyproduct]=useState(()=>{
return JSON.parse(localStorage.getItem('cart')) || [];
});

 const addProduct = async (product) => {
try {
const user = JSON.parse(localStorage.getItem("user"));
if (!user) {
alert("Please login first");
navigate("/login");
return;
}
await axios.post("http://localhost:5000/cart", {
    productId: product._id,
    quantity: qty,
    email: user.email,
});
alert("Added to cart");
navigate("/cart");
} catch (err) {
console.error(err);
}
};

return (
<div className="details">
<img src={`http://localhost:5000/uploads/${product.imageUpload}`}alt={product.title}className="productimage"/>
<h2>{product.title}</h2>
<p className="price">Rs.{product.price}</p>
<p>Rating {product.rating}</p>

<div className="quantity">
<button onClick={decreaseQty}>-</button>
<span>{qty}</span>
<button onClick={increaseQty}>+</button>
</div>

<div className="btns">

<button className="addcart" onClick={() => addProduct(product)}>Add to Cart</button>
<button onClick={() => navigate("/checkout")}>Buy Now</button>
</div>
</div>
);
}

export default ProDetails;