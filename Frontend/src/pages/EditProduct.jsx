import React from 'react'
import "./EditProduct.css";
import { useState,useEffect } from "react";
import axios from "axios";
import { useParams,useNavigate } from 'react-router-dom';
function EditProduct() {
    const {id}=useParams();
    const navigate=useNavigate();
   const[product,setProduct]=useState({
    title:"",
    imageUpload:"",
    category:"",
    price:"",
    quantity:"",
    rating:""

   });
 const { title, category, price, quantity, rating } = product;


useEffect(()=>{
axios.get(`http://localhost:5000/addproduct/${id}`)
.then(res=>setProduct(res.data))
.catch(err=>console.log(err));
},[id]);

const handleChange = (e) => {
setProduct({...product,[e.target.name]: e.target.value});};

const handleImage = (e) => {
setProduct({...product,imageUpload: e.target.files[0]});};

const handleSubmit = (e) => {
  e.preventDefault();
  const formData = new FormData();
  formData.append("title",product.title);
  formData.append("image",product.imageUpload);
  formData.append("category",product.category);
  formData.append("price",product.price);
  formData.append("quantity",product.quantity);
  formData.append("rating",product.rating);
  axios.put(`http://localhost:5000/addproduct/${id}`, formData)
.then(() => {
alert("Product Updated Successfully");
navigate("/products");
})
};


return (
<div className="admin">
<h2>Update Product</h2>
<form onSubmit={handleSubmit}>
<div className="form">
<label>Product Title</label>
<input type="text"name="title"placeholder="Enter product title"value={title}onChange={handleChange}/>
</div>
<div className="form">
<label>File Upload</label>
<input type="file" name="imageUpload"onChange={handleImage}/>
</div>
<div className="form">
<label>Categories</label>
<select name="category"value={category} onChange={handleChange} >
<option>Select Categories</option>
<option>Sunscreen</option>
<option>Fragrance</option>
<option>Moisturizer</option>
<option>Cleanser</option>
<option>Serum</option>
<option>Toners</option>
<option>Lip Care</option>
<option>Dew Drops</option>
</select>
</div>
<div className="form">
<label>Price</label>
<input type="number"name="price"placeholder="Enter price"value={price}onChange={handleChange}/>
</div>
<div className="form">
<label>Quantity</label>
<input type="number"name="quantity"placeholder="Enter quantity"value={quantity}onChange={handleChange}/>
</div>
<div className="form">
<label>Rating</label>
<input type="number"name="rating"placeholder="Enter rating"value={rating}onChange={handleChange}/>
</div>
<button type="submit" className="btn">Update Product</button>
</form>
</div>
);
  
}

export default EditProduct;