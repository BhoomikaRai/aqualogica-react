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

const app = express();
app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));

mongoose.connect(process.env.MONGO_URI);

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendOrderEmail = async (email, status, orderId) => {
let subject = "";
let message = "";

if (status === "Placed") {
  subject = "From Aqualogica: Order Confirmed ";
  message = `Your order has been placed successfully. We will notify you once it is shipped.`;
}

if (status === "Shipped") {
  subject = "From Aqualogica: Order Shipped";
  message = ` Your order has been shipped. You can expect delivery soon!`;
}
if (status === "Delivered") {
  subject = "From Aqualogica: Order Delivered";
  message = `Your order  has been delivered.Thank you for shopping with us!`;
}


const mailOptions = {
  from: "bhoomikarai147@gmail.com",
  to: email,
  subject,
  text: message,
};
await transporter.sendMail(mailOptions);
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

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
    imageUpload: req.file.filename,
    category: req.body.category,
    price: req.body.price,
    quantity: req.body.quantity,
    rating: req.body.rating,
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
const { title, price, rating, category, quantity } = req.body;
const updateData = {
  title,
  price,
  rating,
  category,
  quantity,
  };
if (req.file) {
updateData.imageUpload = req.file.filename;
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
await CartModel.deleteMany({email});
await sendOrderEmail(
email,
"Placed",
order._id
);
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
await sendOrderEmail(
order.address.email,
status,
order._id
);
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

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});




