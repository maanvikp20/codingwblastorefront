const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  dimensions: { type: String, match: /\d+x\d+x\d+/ },
  category: String,
  totalPurchases: Number,
  discount: mongoose.Schema.Types.Decimal128,

  filament: {
    type: String,
    required: true,
    enum: ["PLA", "PETG", "ABS", "TPU", "ASA", "NYLON", "RESIN"],
  },

  source: String,

  avgRating: { type: Number, default: 0 },

  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },

  comments: [{}]
}, { timestamps: true });

module.exports = mongoose.models.Product || mongoose.model("Product", productSchema)

