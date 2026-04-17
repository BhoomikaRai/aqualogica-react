import React from 'react'
import "./ManageProduct.css";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import { useState, useEffect } from "react";
function ManageProduct() {

const [products,setProducts]=useState([]);
const navigate=useNavigate();

useEffect(()=>{

axios.get("http://localhost:5000/addproduct")
.then(res=>setProducts(res.data))

.catch(err=>console.log(err));
},[]);

const deleteProduct = async(id)=>{
if(window.confirm("Are you sure you want to delete this product?"))
{
try{
  await axios.delete(`http://localhost:5000/addproduct/${id}`);
  alert("Product deleted successfully");
  setProducts(products.filter(product=>product._id!==id));
      
}
catch(err){
  console.log(err);
}
}

}
return (
<div className="product-management">
<h2>Manage Products</h2>
<table className="product-table">
<thead>
<tr>
  <th>Title</th>
  <th>Category</th>
  <th>Price</th>
  <th>Quantity</th>
  <th>Rating</th>
  <th>Image</th>
  <th>Action</th>
</tr>
</thead>
<tbody>
{products.map(product=>(

<tr key={product._id}>
<td>{product.title}</td>
<td>{product.category}</td>
<td>{product.price}</td>
<td>{product.quantity}</td>
<td>{product.rating}</td>
<td><img src={`http://localhost:5000/uploads/${product.imageUpload}`} alt={product.title} /></td>
<td>
<button className="edit-btn" onClick={()=>navigate(`/EditProduct/${product._id}`)} >Edit </button>
<button className="delete-btn"onClick={()=>deleteProduct(product._id)}>Delete</button>
</td>
</tr>))}

</tbody>
</table>
</div>
);
}

export default ManageProduct;