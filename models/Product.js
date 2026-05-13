import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema(
  {
    author:  { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true, maxlength: 2000 },
    likes:   [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    replies: [
      {
        author:    { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        content:   { type: String, maxlength: 1000 },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const ReportSchema = new mongoose.Schema(
  {
    reporter: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    reason: {
      type: String,
      enum: ["spam", "inappropriate", "copyright", "misleading", "other"],
      required: true,
    },
    details:    { type: String, maxlength: 1000 },
    status:     { type: String, enum: ["pending", "reviewed", "dismissed", "actioned"], default: "pending" },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    reviewedAt: { type: Date },
  },
  { timestamps: true }
);

const DonationSchema = new mongoose.Schema(
  {
    donor:     { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    amount:    { type: Number, required: true, min: 0.5 },
    message:   { type: String, maxlength: 500 },
    anonymous: { type: Boolean, default: false },
    stripePaymentIntentId: { type: String },
  },
  { timestamps: true }
);

const ProductSchema = new mongoose.Schema(
  {
    title:       { type: String, required: true, trim: true },
    // ✅ slug added here — single definition, no duplicate
    slug:        { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, required: true },
    creator:     { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    // Media
    images:    [{ type: String }],
    modelFile: { type: String },
    thumbnail: { type: String },

    // Categorization
    category:   { type: String, required: true },
    tags:       [{ type: String }],
    material:   { type: String },
    color:      { type: String },
    difficulty: { type: String, enum: ["easy", "medium", "hard", "expert"] },
    printTime:  { type: Number },
    filament:   { type: Number },
    scale:      { type: String },

    // Pricing
    price:  { type: Number, default: 0 },
    isFree: { type: Boolean, default: true },

    // Availability
    availability: {
      status:       { type: String, enum: ["available", "limited", "unavailable", "preorder"], default: "available" },
      stock:        { type: Number, default: null },
      preorderDate: { type: Date },
      note:         { type: String },
    },

    // Admin Controls
    status:        { type: String, enum: ["pending", "approved", "rejected", "flagged"], default: "pending" },
    featured:      { type: Boolean, default: false },
    isPrintOfDay:  { type: Boolean, default: false },
    printOfDayDate: { type: Date },
    adminNotes:    { type: String },
    approvedBy:    { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    approvedAt:    { type: Date },

    // Sketch
    isRoughSketch: { type: Boolean, default: false },
    sketchNotes:   { type: String },

    // Interactions
    likes:        [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    dislikes:     [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    views:        { type: Number, default: 0 },
    likeCount:    { type: Number, default: 0 },
    dislikeCount: { type: Number, default: 0 },
    score:        { type: Number, default: 0 },

    // Comments & Reports
    comments:    [CommentSchema],
    reports:     [ReportSchema],
    reportCount: { type: Number, default: 0 },

    // Crowdfunding
    crowdfunding: {
      enabled:  { type: Boolean, default: false },
      goal:     { type: Number, default: 0 },
      raised:   { type: Number, default: 0 },
      deadline: { type: Date },
      backers:  { type: Number, default: 0 },
    },
    donations: [DonationSchema],
  },
  { timestamps: true }
);

// ✅ Indexes — slug is already unique via schema definition above, not repeated here
ProductSchema.index({ title: "text", description: "text", tags: "text" });
ProductSchema.index({ score: -1 });
ProductSchema.index({ featured: 1, status: 1 });
ProductSchema.index({ isPrintOfDay: 1 });
ProductSchema.index({ creator: 1 });
ProductSchema.index({ category: 1, status: 1 });

// Score recalculation
ProductSchema.pre("save", function (next) {
  this.likeCount    = this.likes.length;
  this.dislikeCount = this.dislikes.length;
  const n = this.likeCount + this.dislikeCount;
  if (n === 0) {
    this.score = 0;
  } else {
    const p = this.likeCount / n;
    const z = 1.96;
    this.score =
      (p + (z * z) / (2 * n) - z * Math.sqrt((p * (1 - p) + (z * z) / (4 * n)) / n)) /
      (1 + (z * z) / n);
  }
  this.reportCount = this.reports.length;
  next();
});

export default mongoose.models.Product || mongoose.model("Product", ProductSchema);