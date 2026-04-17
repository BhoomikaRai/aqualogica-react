import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Register from "./components/Register";
import Footer from "./components/Footer";
import Range from "./pages/Range";
import Routine from "./pages/Routine";
import Home from "./pages/Home";
import SkinConcern from "./pages/SkinConcern";
import OurStory from "./pages/OurStory";
import TrackOrder from "./pages/TrackOrder";
import WaterForAll from "./pages/WaterForAll";
import NeedHelp from "./pages/NeedHelp";
import Dashboard from "./pages/Dashboard";
import { Routes, Route, useLocation } from "react-router-dom";
import "react-multi-carousel/lib/styles.css";
import Admin from "./pages/Admin";
import ManageProduct from "./pages/ManageProduct";
import EditProduct from "./pages/EditProduct";
import ManageOrder from "./pages/ManageOrder";
import ProDetails from "./pages/ProDetails";
import Checkout from "./pages/Checkout";
import Cart from "./pages/Cart";
import Payment from "./pages/Payment";
import CategoryPage from "./pages/CategoryPage";
import AdminProtectRoute from "./components/AdminProtectRoute";
import Profile from "./pages/Profile";
import OrderHistory from "./pages/OrderHistory";

function App() {
const location = useLocation();
const hideLayout =
location.pathname === "/admin" ||
location.pathname.startsWith("/dashboard") ||
location.pathname.startsWith("/products") ||
location.pathname.startsWith("/EditProduct") ||
location.pathname === "/order"; 

return (
<>

{!hideLayout && <Navbar />}
<Routes>
<Route path="/login" element={<Login />} />
<Route path="/signup" element={<Register />} />
<Route path="/" element={<Home />} />
<Route path="/range" element={<Range />} />
<Route path="/routine" element={<Routine />} />
<Route path="/skin-concern" element={<SkinConcern />} />
<Route path="/our-story" element={<OurStory />} />
<Route path="/track-order" element={<TrackOrder />} />
<Route path="/water-for-all" element={<WaterForAll />} />
<Route path="/need-help" element={<NeedHelp />} />
<Route path="/product/:id" element={<ProDetails />} />
<Route path="/checkout" element={<Checkout />} />
<Route path="/cart" element={<Cart />} />
<Route path="/payment" element={<Payment />} />
<Route path="/category/:name" element={<CategoryPage />} />
<Route path="/profile" element={<Profile />} />
<Route path="/order-history" element={<OrderHistory />} />

<Route element={<AdminProtectRoute />}>
<Route path="/admin" element={<Admin />} />
<Route path="/dashboard" element={<Dashboard />} />
<Route path="/products" element={<ManageProduct />} />
<Route path="/EditProduct/:id" element={<EditProduct />} />
<Route path="/order" element={<ManageOrder />} />
</Route>
</Routes>

{!hideLayout && <Footer />}
</>
);
}

export default App;