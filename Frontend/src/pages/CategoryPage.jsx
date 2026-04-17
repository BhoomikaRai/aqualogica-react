import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "./Home.css";

function CategoryPage() {
const { name } = useParams();
const [products, setProducts] = useState([]);
const navigate = useNavigate();
useEffect(() => {
axios.get(`http://localhost:5000/search?query=${name}`)
.then((res) => setProducts(res.data))
.catch((err) => console.log(err));
}, [name]);
return (
<div className="home">
<h2 style={{ textAlign: "center", margin: "20px" }}>
{name}
</h2>
<div className="grid">
{products.length > 0 ? (
products.map((product) => (
<div className="productcard"key={product._id}onClick={() => navigate(`/product/${product._id}`)}>
<img src={`http://localhost:5000/uploads/${product.imageUpload}`}alt={product.title}className="productimg"/>
<h3>{product.title}</h3>
<p>Rs.{product.price}</p>
<p>Rating {product.rating}</p>
</div>
))
) : (
<p>No products found</p>
)}
</div>
</div>
 );
}

export default CategoryPage;