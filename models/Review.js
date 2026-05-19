import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String, maxlength: 200 },
    body: { type: String, maxlength: 3000 },
    images: [{ type: String }],
    verified: { type: Boolean, default: false },
  },
  { timestamps: true },
);

// One user can only review a product once
ReviewSchema.index({ product: 1, author: 1 }, { unique: true });

export default mongoose.models.Review ||
  mongoose.model("Review", ReviewSchema);
