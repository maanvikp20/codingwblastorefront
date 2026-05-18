import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, default: 0 },
    isFree: { type: Boolean, default: false },
    discount: { type: Number, default: 0, min: 0, max: 100 },
    modelFile: { type: String },
    thumbnail: { type: String },
    images: [{ type: String }],

    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    attributionType: {
      type: String,
      enum: ["individual", "student_group", "imported"],
      default: "individual",
    },
    groupName: { type: String, trim: true },
    source: { type: String },

    dimensions: {
      x: { type: Number },
      y: { type: Number },
      z: { type: Number },
      unit: { type: String, enum: ["mm", "cm", "in"], default: "mm" },
    },
    category: {
      type: String,
      enum: [
        "figurines",
        "tools",
        "home",
        "jewelry",
        "art",
        "mechanical",
        "educational",
        "cosplay",
        "other",
      ],
      required: true,
    },

    stockCount: { type: Number, default: 0 },
    isPrintableNow: { type: Boolean, default: true },
    availableFilaments: [{ type: String }],

    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
    rating: { type: Number, default: 0 },
    totalPurchases: { type: Number, default: 0 },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    featured: { type: Boolean, default: false },

    isPrintOfTheDay: { type: Boolean, default: false },
    isPrintOfTheWeek: { type: Boolean, default: false },
    isPrintOfTheMonth: { type: Boolean, default: false },
  },
  { timestamps: true },
);

ProductSchema.index({ name: "text", description: "text", groupName: "text" });

ProductSchema.pre("validate", function (next) {
  if (this.isModified("name") && !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }
  next();
});

export default mongoose.models.Product ||
  mongoose.model("Product", ProductSchema);
