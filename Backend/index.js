const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const nodemailer = require("nodemailer");
require("dotenv").config();

const ProductModel = require("./models/Product");
const CartModel = require("./models/Cart");
const UserModel = require("./models/User");
const OrderModel = require("./models/Order");
const crypto = require("crypto");

const puppeteer = require("puppeteer");

const { v2: cloudinary } = require("cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "products",
  },
});

const upload = multer({ storage });
 
const app = express();
app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB connected successfully"))
.catch((err) => console.log("mongoDB connection error:",err));

// mongoose.connect("mongodb://localhost:27017/user");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
const generateHTML = (order) => {

const subtotal = order.totalAmount / 1.18;
const cgst = subtotal * 0.09;
const sgst = subtotal * 0.09;
const total = order.totalAmount;

return `
<html>
<head>
<style>
body { font-family: Arial; padding: 25px; }

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid #ddd;
  padding-bottom: 10px;
}

.logo img {
  height: 50px;
}

.company {
  text-align: right;
  font-size: 12px;
}

h1 {
  text-align: center;
  margin-top: 20px;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

th {
  background-color: #f2f2f2;
}

th, td {
  border: 1px solid #ccc;
  padding: 10px;
  text-align: center;
}

.right {
  text-align: right;
  margin-top: 20px;
}

.total {
  font-size: 18px;
  font-weight: bold;
}
</style>
</head>

<body>

<div class="header">
<div class="logo">
<h2>Aqualogica</h2>
</div>

<div class="company">
<b>Aqualogica</b><br/>
Bangalore, India<br/>
GSTIN: 29ABCDE1234F1Z5<br/>
Email: support@aqualogica.com
</div>
</div>


<h1>GST INVOICE</h1>

<div style="display:flex; justify-content:space-between; margin-top:20px;">

<div>
<h3>Billed To:</h3>
<p><b>${order.address.name}</b></p>
<p>
${order.address.house}, ${order.address.area}<br/>
${order.address.city}, ${order.address.state} - ${order.address.pincode}
</p>
<p>Phone: ${order.address.phone}</p>
<p>Email: ${order.address.email}</p>
</div>

<div style="text-align:right;">
<p><b>Order ID:</b> ${order._id}</p>
<p><b>Date:</b> ${new Date(order.createdAt).toLocaleDateString()}</p>
<p><b>Payment:</b> ${order.paymentMethod}</p>
</div>

</div>

<table>
<tr>
<th>#</th>
<th>Product</th>
<th>Price </th>
<th>Qty</th>
<th>Total </th>
</tr>

${order.products.map((p, i) => {
const name = p.productId?.title || "Product";
const price = p.productId?.price || 0;
const itemTotal = price * p.quantity;

return `
<tr>
<td>${i + 1}</td>
<td>${name}</td>
<td>${price}</td>
<td>${p.quantity}</td>
<td>${itemTotal}</td>
</tr>
`;
}).join("")}
</table>

<div class="right">
<p>Subtotal: ₹${subtotal.toFixed(2)}</p>
<p>CGST (9%): ₹${cgst.toFixed(2)}</p>
<p>SGST (9%): ₹${sgst.toFixed(2)}</p>
<h2>Total: ₹${total.toFixed(2)}</h2>
</div>

<p>Thank you for shopping with us!</p>

</body>
</html>
`;
};

const generateInvoice = async (order) => {
const browser = await puppeteer.launch({
args: ["--no-sandbox", "--disable-setuid-sandbox"],
});
const page = await browser.newPage();
const html = generateHTML(order);
await page.setContent(html, { waitUntil: "domcontentloaded" });
const pdfBuffer = await page.pdf({format: "A4",});
await browser.close();
return pdfBuffer;
};

const sendOrderEmail = async (email, status, order) => {
let subject = "";
let message = "";

if (status === "Placed") {
subject = "Order Confirmed with Invoice";
message = "Your order has been placed successfully. Invoice attached.";
}

if (status === "Shipped") {
subject = "Order Shipped";
message = "Your order has been shipped.";
}
if (status === "Delivered") {
subject = "Order Delivered";
message = "Your order has been delivered.";
}


let attachments = [];
if (status === "Placed") {
const pdfBuffer = await generateInvoice(order);
attachments.push({
filename: `invoice_${order._id}.pdf`,
content: pdfBuffer,
    });
  }
 
const mailOptions = {
from: process.env.EMAIL_USER,
to: email,
subject,
text: message,
attachments,
};

await transporter.sendMail(mailOptions);
};

// const sendOrderEmail = async (email, status, orderId) => {
// let subject = "";
// let message = "";

// if (status === "Placed") {
//   subject = "From Aqualogica: Order Confirmed ";
//   message = `Your order has been placed successfully. We will notify you once it is shipped.`;
// }

// if (status === "Shipped") {
//   subject = "From Aqualogica: Order Shipped";
//   message = ` Your order has been shipped. You can expect delivery soon!`;
// }
// if (status === "Delivered") {
//   subject = "From Aqualogica: Order Delivered";
//   message = `Your order  has been delivered.Thank you for shopping with us!`;
// }


// const mailOptions = {
//   from: "bhoomikarai147@gmail.com",
//   to: email,
//   subject,
//   text: message,
// };
// await transporter.sendMail(mailOptions);
// };

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, "uploads/"),
//   filename: (req, file, cb) =>
//     cb(null, Date.now() + "-" + file.originalname),
// });
// const upload = multer({ storage });

app.post('/login', (req, res) => {
const { email, password } = req.body;
UserModel.findOne({ email: email })
.then(user => {
if (user) {
if (user.password === password) {
res.json("Success")
} else {
res.json("The password is incorrect")
}
} else {
res.json("No user found")
}
})       
})

app.post("/register", async (req, res) => {
try {
const user = await UserModel.create(req.body);
res.json({ message: "User registered", user });
} catch (err) {
res.status(500).json(err);
}
});

app.post("/addproduct", upload.single("image"), async (req, res) => {
  const productDetail = {
    title: req.body.title,
    imageUpload: req.file.path,
    category: req.body.category,
    price: req.body.price,
    quantity: req.body.quantity,
    rating: req.body.rating,
    description: req.body.description,
  };
  const product = await ProductModel.create(productDetail);
  res.json(product);
});

app.get("/addproduct", async (req, res) => {
  const products = await ProductModel.find();
  res.json(products);
});

app.delete("/addproduct/:id", async (req, res) => {
try {
await ProductModel.findByIdAndDelete(req.params.id);
res.json({ message: "Product deleted" });
} catch (err) {
res.status(500).json(err);
}
});

app.get("/addproduct/:id", async (req, res) => {
  const product = await ProductModel.findById(req.params.id);
  res.json(product);
});

app.put("/addproduct/:id", upload.single("image"), async (req, res) => {
try {
const { title, price, rating, category, quantity, description } = req.body;
const updateData = {
  title,
  price,
  rating,
  category,
  quantity,
  description,
  };
if (req.file) {
updateData.imageUpload = req.file.path;
}
const updated = await ProductModel.findByIdAndUpdate(
req.params.id,
updateData,
{ new: true }
);
res.json(updated);
} catch (err) {
console.error(err);
res.status(500).json(err);
}
});

app.post("/cart", async (req, res) => {
try {
const { productId, quantity, email } = req.body;
if (!email) {
return res.status(400).json({ message: "Email required" });
}

const existing = await CartModel.findOne({ productId, email });
if (existing) {
existing.quantity += quantity;
await existing.save();
return res.json(existing);
}
const newItem = await CartModel.create({productId,quantity,email,});
res.json(newItem);
} catch (err) {
  console.error("ADD CART ERROR:", err);
  res.status(500).json(err);
  }
});

app.get("/cart", async (req, res) => {
try {
  const { email } = req.query;
 if (!email) {
  return res.status(400).json({ message: "Email required" });
}
const items = await CartModel.find({ email }).populate("productId");
res.json(items);
} catch (err) {
console.error("CART ERROR:", err);
res.status(500).json(err);
}
});

app.delete("/cart/:id", async (req, res) => {
try {
  const { email } = req.query;
await CartModel.findOneAndDelete({
_id: req.params.id,
email,
});
res.json("Deleted");
} catch (err) {
console.error(err);
res.status(500).json(err);
}
});

app.put("/cart/:id", async (req, res) => {
try {
const { email } = req.query;
const updated = await CartModel.findOneAndUpdate(
{ _id: req.params.id, email },
{ quantity: req.body.quantity },
{ new: true }
);
res.json(updated);
} catch (err) {
console.error(err);
res.status(500).json(err);
}
});

app.post("/order", async (req, res) => {
try {
const { products, totalAmount, address, paymentMethod, paymentId, email } = req.body;
const order = await OrderModel.create({
products,
totalAmount,
address,
paymentMethod,
paymentId,
email,
});

await CartModel.deleteMany({ email });

const populatedOrder = await OrderModel.findById(order._id)
.populate("products.productId");

await sendOrderEmail(email, "Placed", populatedOrder);
res.json({ message: "Order placed", order });
} catch (err) {
console.error(err);
res.status(500).json(err);
}
});

app.get("/order", async (req, res) => {
try {
const { email } = req.query;
let orders;
if (email) {
orders = await OrderModel.find({ email }).populate("products.productId");
} else {
orders = await OrderModel.find().populate("products.productId");
}
res.json(orders);
} catch (err) {
  console.error(err);
  res.status(500).json(err);
  }
});



app.put("/order/:id", async (req, res) => {
try {
const { status } = req.body;
const order = await OrderModel.findById(req.params.id);
if (!order) return res.json("Order not found");
order.status = status;
await order.save();
if (status === "Shipped" || status === "Delivered") {
// await sendOrderEmail(
// order.address.email,
// status,
// order._id
// );
await sendOrderEmail(order.email, status, order);
}
res.json(order);
} catch (err) {
  console.error(err);
  res.status(500).json(err);
}
});

app.delete("/order/:id", async (req, res) => {
try {
await OrderModel.findByIdAndDelete(req.params.id);
res.json({ message: "Order deleted" });
} catch (err) {
res.status(500).json(err);
}
});

app.get("/search", async (req, res) => {
try {
const query = req.query.query;
if (!query) {
const products = await ProductModel.find();
return res.json(products);
}
const products = await ProductModel.find({
$or: [
  { title: { $regex: query, $options: "i" } },
  { category: { $regex: query, $options: "i" } }
  ]
});
res.json(products);
} catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});


const Razorpay = require("razorpay");

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

app.post("/create-order", async (req, res) => {
try {
  const { amount } = req.body;
  const options = {
    amount: amount * 100, 
    currency: "INR",
    receipt: "order_rcptid_" + Date.now()
  };
  const order = await razorpay.orders.create(options);
  res.json(order);

} catch (err) {
  res.status(500).send(err);
}
});

app.post("/verify-payment", (req, res) => {
try {
const {
razorpay_order_id,
razorpay_payment_id,
razorpay_signature,
} = req.body;
const body = razorpay_order_id + "|" + razorpay_payment_id;
const expectedSignature = crypto
.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
.update(body.toString())
.digest("hex");
if (expectedSignature === razorpay_signature) {
  res.json({ success: true });
} else {
  res.json({ success: false });
}
} catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
}
});

app.get("/users", async (req, res) => {
  try {
    const users = await UserModel.find();
    res.json(users);
  } catch (err) {
    res.status(500).json(err);
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});




