import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import "./Home.css";

function Home() {
const [products, setProducts] = useState([]);
const navigate = useNavigate();
const location = useLocation();
const category = new URLSearchParams(location.search).get("category");
useEffect(() => {
const url = category
? `https://aqualogica-react-backend.onrender.com/search?query=${category}`
: `https://aqualogica-react-backend.onrender.com/addproduct`;

axios.get(url)
.then((res) => setProducts(res.data))
.catch((err) => console.log(err));
}, [category]);

const responsive = {
    desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 1,
},
};

return (
<div className="home">
<div className="categories">
<div className="categoryitem">
<img src="cat1.png" alt="Sunscreen"onClick={() => navigate("/category/Sunscreen")} />
<p>Sunscreen</p>
</div>

<div className="categoryitem">
<img src="cat2.png" alt="Fragrance"onClick={() => navigate("/category/Fragrance")} />
<p>Fragrance</p>
</div>

<div className="categoryitem">
<img src="cat3.png" alt="Moisturizer"onClick={() => navigate("/category/Moisturizer")} />
<p>Moisturizer</p>
</div>

<div className="categoryitem">
<img src="cat4.png" alt="Cleanser"onClick={() => navigate("/category/Cleanser")} />
<p>Cleanser</p>
</div>

<div className="categoryitem">
<img src="cat5.png" alt="Serum"onClick={() => navigate("/category/Serum")} />
<p>Serum</p>
</div>

<div className="categoryitem">
<img src="cat6.png" alt="Toners"onClick={() => navigate("/category/Toners")} />
<p>Toners</p>
</div>

<div className="categoryitem">
<img src="cat7.png" alt="Lipbalm"onClick={() => navigate("/category/Lipbalm")} />
<p>Lipbalm</p>
</div>

<div className="categoryitem">
<img src="cat8.png" alt="Dew Drops"onClick={() => navigate("/category/Dew Drops")} />
<p>Dew Drops</p>
</div>
</div>

<Carousel responsive={responsive} 
autoPlay autoPlaySpeed={2000}
 infinite>
<div className="slide"><img src="pro1.png" alt="" /></div>
<div className="slide"><img src="pro2.png" alt="" /></div>
<div className="slide"><img src="pro3.png" alt="" /></div>
<div className="slide"><img src="pro4.png" alt="" /></div>
</Carousel>

<div className="buttons">
<button onClick={() => navigate("/")}>All</button>
<button onClick={() => navigate("/?category=Sunscreen")}>Sunscreen</button>
<button onClick={() => navigate("/?category=Fragrance")}>Fragrance</button>
<button onClick={() => navigate("/?category=Moisturizer")}>Moisturizer</button>
<button onClick={() => navigate("/?category=Cleanser")}>Cleanser</button>
<button onClick={() => navigate("/?category=Serum")}>Serum</button>
<button onClick={() => navigate("/?category=Toners")}>Toners</button>
<button onClick={() => navigate("/?category=Lipbalm")}>Lipbalm</button>
<button onClick={() => navigate("/?category=Dew Drops")}>Dew Drops</button>
</div>

<div className="grid">
{products.length > 0 ? (
products.map((product) => (
<div className="productcard" key={product._id} onClick={() => navigate(`/product/${product._id}`)}>
<img src={`http://localhost:5000/uploads/${product.imageUpload}`}alt={product.title}className="productimg"/>
<h3>{product.title}</h3>
<p>Rs.{product.price}</p>
<p>Rating {product.rating}</p>
</div>
))
) : (
<p className="no-results">
No products found for "{category}"
</p>
)}
</div>
<div className="water"onClick={()=>navigate("/water-for-all")}>
<img src="water.png" alt="Water" />
</div>
</div>
);
}

export default Home;
