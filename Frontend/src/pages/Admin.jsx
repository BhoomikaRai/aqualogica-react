import React, { useState } from "react";
import axios from "axios";
import "./admin.css";

function Admin() {
const [title, setTitle] = useState("");
const [imageUpload, setImageUpload] = useState(null);
const [category, setCategory] = useState("");
const [price, setPrice] = useState("");
const [quantity, setQuantity] = useState("");
const [rating, setRating] = useState("");
const handleSubmit = (e) => {
  e.preventDefault();
  const formData = new FormData();
  formData.append("title", title);
  formData.append("image", imageUpload);
  formData.append("category", category);
  formData.append("price", price);
  formData.append("quantity", quantity);
  formData.append("rating", rating);
  axios.post("http://localhost:5000/addproduct", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  })
  .then(() => {
    alert("Product Added Successfully");
  })
  .catch(err => console.log(err));
};
return (
<div className="admin">
<h2>Add Product</h2>
<form onSubmit={handleSubmit}>
<div className="form">
<label>Product Title</label>
<input type="text"placeholder="Enter product title"value={title}onChange={(e) => setTitle(e.target.value)}required/>
</div>
<div className="form">
<label>File Upload</label>
<input type="file"onChange={(e) => setImageUpload(e.target.files[0])}required/>
</div>
<div className="form">
<label>Categories</label>
<select value={category} onChange={(e) => setCategory(e.target.value)} required>
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
<input type="number"placeholder="Enter price"value={price}onChange={(e) => setPrice(e.target.value)}required/>
</div>
<div className="form">
<label>Quantity</label>
<input type="number"placeholder="Enter quantity"value={quantity}onChange={(e) => setQuantity(e.target.value)}required/>
</div>
<div className="form">
<label>Rating</label>
<input type="number"placeholder="Enter rating"value={rating}onChange={(e) => setRating(e.target.value)}required/>
</div>
<button type="submit" className="btn">Add Product</button>
</form>
</div>
);
}
export default Admin;