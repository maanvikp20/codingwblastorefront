import mongoose from "mongoose";

const BlogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: { type: String, required: true },
    excerpt: { type: String, maxlength: 500 },
    coverImage: { type: String },
    category: { type: String, default: "other" },
    tags: [{ type: String }],
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },
    publishedAt: { type: Date },
    views: { type: Number, default: 0 },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true },
);

// Search indexing
BlogSchema.index({ title: "text", content: "text", tags: "text" });
BlogSchema.index({ status: 1, publishedAt: -1 });

// Auto-generate slug from title
BlogSchema.pre("validate", function (next) {
  if (this.isModified("title") && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }
  next();
});

export default mongoose.models.Blog || mongoose.model("Blog", BlogSchema);
