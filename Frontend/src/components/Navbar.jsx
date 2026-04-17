import "./navbar.css";
import logo from "../assets/aqua.png";
import searchIcon from "../assets/search.png";
import loginIcon from "../assets/login.png";
import shopIcon from "../assets/shop.png";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function Navbar() {
const navigate = useNavigate();
const [search, setSearch] = useState("");
const [showDropdown, setShowDropdown] = useState(false);
const user = JSON.parse(localStorage.getItem("user"));

const handleSearch = () => {
if (search.trim()) {
navigate(`/?category=${search}`);
setSearch("");
}
};

return (
<>

<div className="top">
Buy 4 Products at Rs:1299 | Use Code: MEGADEAL
</div>
<div className="navbar">
<div className="nav-left">
<div className="logo">
<img src={logo} alt="Aqualogica"onClick={() => navigate("/")}/>
</div>

<ul className="menu">
<li className="dropdown">
Range
<ul className="dropdown-menu">
<li onClick={() => navigate("/?category=glow")}>Glow+</li>
<li onClick={() => navigate("/?category=refresh")}>Refresh+</li>
<li onClick={() => navigate("/?category=radiance")}>Radiance+</li>
<li onClick={() => navigate("/?category=detan")}>Detan+</li>
<li onClick={() => navigate("/?category=illuminate")}>Illuminate+</li>
<li onClick={() => navigate("/?category=barrier")}>Barrier+</li>
<li onClick={() => navigate("/?category=bright")}>Bright+</li>
<li onClick={() => navigate("/?category=hydrate")}>Hydrate+</li>
</ul>
</li>

<li className="dropdown">
Routine
<ul className="dropdown-menu">
<li onClick={() => navigate("/category/Sunscreen")}>Sunscreen</li>
<li onClick={() => navigate("/category/Moisturizer")}>Moisturizer and Cream</li>
<li onClick={() => navigate("/category/Fragrance")}>Fragrance</li>
<li onClick={() => navigate("/category/Cleanser")}>Cleansers</li>
<li onClick={() => navigate("/category/Serum")}>Serum</li>
<li onClick={() => navigate("/category/Dew Drops")}>Dew Drops</li>
<li onClick={() => navigate("/category/Body")}>Body</li>
<li onClick={() => navigate("/category/Lipbalm")}>Lip Care</li>
<li onClick={() => navigate("/category/Toners")}>Toners</li>
</ul>
</li>

<li onClick={() => navigate("/skin-concern")}>Skin Concern</li>
<li onClick={() => navigate("/our-story")}>Our Story</li>
<li onClick={() => navigate("/track-order")}>Track Order</li>
<li onClick={() => navigate("/water-for-all")}>Water for All</li>
<li onClick={() => navigate("/need-help")}>Need Help?</li>
</ul>
</div>

<div className="navright">
<div className="search-box">
<img src={searchIcon} className="search-icon" alt="search"onClick={handleSearch}/>
<input type="text"placeholder="Search products..."value={search}onChange={(e) => setSearch(e.target.value)}
onKeyDown={(e) => e.key === "Enter" && handleSearch()} />
</div>

{user ? (
<div className="profile-section">
<img src={loginIcon} className="icon" alt="profile"onClick={() => setShowDropdown(!showDropdown)}/>
{showDropdown && (

<div className="dropdown-box">
<p onClick={() => navigate("/profile")}>Your Profile</p>
<p onClick={() => navigate("/order-history")}>Order History</p>

<p className="logout" onClick={() => {
localStorage.removeItem("user");
setShowDropdown(false);
navigate("/login");
}}>Logout</p>
</div>
)}
</div>
) : (
<img src={loginIcon}className="icon"alt="login"onClick={() => navigate("/login")}/>)}

<div className="shop-box">
<img src={shopIcon} className="icon"alt="shop"
onClick={() => {
if (!user) {
alert("Please login first");
navigate("/login");
} else {
navigate("/cart");
}
}}
/>
</div>
</div>
</div>
</>
);
}

export default Navbar;