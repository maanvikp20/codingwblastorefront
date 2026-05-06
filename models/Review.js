const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    name: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    review: {type: String, default: ""},
    rating: {type: Number, default: 0}
  },{timestamps: true}
)