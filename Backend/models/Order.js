const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "products",  
      },
      quantity: Number,
      _id: false,
    },
  ],

  totalAmount: Number,

  address: {
    name: String, 
    email: String,
    phone: String,
    house: String,
    area: String,
    city: String,
    state: String,
    pincode: String,
  },

  paymentMethod: String,
  paymentId: String,
  email: String,

  status: {
    type: String,
    enum: ["Pending", "Shipped", "Delivered"], 
    default: "Pending",
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Order", orderSchema);