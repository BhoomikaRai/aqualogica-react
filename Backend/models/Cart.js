const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "products",
    required: true,
  },
  quantity: {
    type: Number,
    default: 1,
  },
  email: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Cart", cartSchema);