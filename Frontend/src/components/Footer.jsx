import React from "react";
import "./footer.css";
function Footer() {
return (
<footer className="footer"> 
<div className="footertop">
<div className="footerleft">
<h2 className="footerlogo">Aqualogica</h2>
<div className="socialmedia">
<img src="/facebook.png" alt="Facebook" />
<img src="/twitter.png" alt="Twitter" />
<img src="/instagram.png" alt="Instagram" />
<img src="/youtube.png" alt="YouTube" />
</div>
<p className="app">Get the App to track your order status smoothly</p>
<div className="appbuttons">
<img src="/googleplay.png" alt="Google Play" />
<img src="/appstore.png" alt="App Store" />
</div>
</div>
<div className="footercolumn">
<h3>My Account</h3>
<p>My Profile</p>
<p>My Orders</p>
<p>Manage Addresses</p>
<p>Request Replacement/Returns</p>
</div>
<div className="footercolumn">
<h3>About us</h3>
<p>Why Aqualogica</p>
<p>Our Science</p>
<p>Ingredients</p>
</div>
<div className="footercolumn">
<h3>Information</h3>
<p>Contact Us</p>
<p>Terms & Conditions</p>
<p>Privacy Policy</p>
<p>Return Policy</p>
</div>
</div>

<div className="footerbottom">
<p>&copy; 2026 Honasa Consumer Limited. All rights reserved.</p>
<div className="payment">
<p>100% Payment Protection, Easy Return Policy</p>
<div className="paymenticons">
<img src="/visa.png" alt="Visa" />
<img src="/mastercard.png" alt="MasterCard" />
<img src="/americanexpress.png" alt="American Express" />
<img src="/pay.png" alt="Rupay" />
<img src="/netbanking.png" alt="Net Banking" />
</div>
</div>
</div>
</footer>
);
}
export default Footer;