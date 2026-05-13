import mongoose from "mongoose";

const BlogSchema = new mongoose.Schema(
  {
    title:      { type: String, required: true, trim: true },
    slug:       { type: String, required: true, unique: true },
    author:     { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    content:    { type: String, required: true },
    excerpt:    { type: String, maxlength: 500 },
    coverImage: { type: String },
    category:   { type: String, default: "other" },
    tags:       [{ type: String }],
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },
    publishedAt: { type: Date },
    views:    { type: Number, default: 0 },
    likes:    [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    comments: [
      {
        author:    { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        content:   { type: String, maxlength: 2000 },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    relatedProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    seo: {
      metaTitle:       { type: String },
      metaDescription: { type: String },
    },
  },
  { timestamps: true }
);

BlogSchema.index({ title: "text", content: "text", tags: "text" });
BlogSchema.index({ status: 1, publishedAt: -1 });

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