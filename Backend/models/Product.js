const mongoose = require("mongoose")
const ProductSchema = new mongoose.Schema({
title: String,
imageUpload: String,
category: String,
price: Number,
quantity: Number,
rating: Number,
description: String,
});
module.exports = mongoose.model("products", ProductSchema);