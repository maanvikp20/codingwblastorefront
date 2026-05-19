/**
 * seed.js
 * Run with: node seed.js
 * Clears all collections and inserts fresh demo data.
 * Requires MONGODB_URI and JWT_SECRET in .env
 */

import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// ─── DB connect ──────────────────────────────────────────────────────────────
if (!process.env.MONGODB_URI) throw new Error("MONGODB_URI missing in .env");
await mongoose.connect(process.env.MONGODB_URI);
console.log("✅  MongoDB connected");

// ─── Inline schemas (mirrors your models) ────────────────────────────────────

const UserSchema = new mongoose.Schema({
  name:                 { type: String, required: true },
  email:                { type: String, required: true, unique: true },
  password:             { type: String, required: true, select: false },
  role:                 { type: String, enum: ["customer", "curator", "partner", "admin"], default: "customer" },
  avatar:               String,
  bio:                  String,
  phoneNumber:          String,
  isActive:             { type: Boolean, default: true },
  lastLogin:            Date,
  uploadedItems:        [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  likes:                [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  dislikes:             [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  previousPurchases:    [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
  passwordResetToken:   { type: String, select: false },
  passwordResetExpires: { type: Date,   select: false },
}, { timestamps: true });

UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 12);
});

const ProductSchema = new mongoose.Schema({
  name:             { type: String, required: true, trim: true },
  slug:             { type: String, required: true, unique: true, lowercase: true },
  description:      { type: String, required: true },
  price:            { type: Number, required: true, default: 0 },
  isFree:           { type: Boolean, default: false },
  discount:         { type: Number, default: 0 },
  modelFile:        String,
  thumbnail:        String,
  images:           [String],
  author:           { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  attributionType:  { type: String, enum: ["individual", "student_group", "imported"], default: "individual" },
  groupName:        { type: String, trim: true },
  source:           String,
  dimensions: {
    x: Number, y: Number, z: Number,
    unit: { type: String, enum: ["mm", "cm", "in"], default: "mm" },
  },
  category: {
    type: String,
    enum: ["figurines", "tools", "home", "jewelry", "art", "mechanical", "educational", "cosplay", "other"],
    required: true,
  },
  stockCount:         { type: Number, default: 0 },
  isPrintableNow:     { type: Boolean, default: true },
  availableFilaments: [String],
  reviews:          [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
  rating:           { type: Number, default: 0 },
  totalPurchases:   { type: Number, default: 0 },
  likes:            [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  dislikes:         [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  status:           { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  featured:         { type: Boolean, default: false },
  isPrintOfTheDay:  { type: Boolean, default: false },
  isPrintOfTheWeek: { type: Boolean, default: false },
  isPrintOfTheMonth:{ type: Boolean, default: false },
  adminNotes:       String,
  approvedBy:       { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  approvedAt:       Date,
}, { timestamps: true });

const ReviewSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  author:  { type: mongoose.Schema.Types.ObjectId, ref: "User",    required: true },
  rating:  { type: Number, required: true, min: 1, max: 5 },
  title:   String,
  body:    String,
}, { timestamps: true });

// Match your real Blog model — uses `content` (not `body`) and requires `slug`
const BlogSchema = new mongoose.Schema({
  title:       { type: String, required: true, trim: true },
  slug:        { type: String, required: true, unique: true },
  author:      { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  content:     { type: String, required: true },
  excerpt:     { type: String, maxlength: 500 },
  coverImage:  String,
  category:    { type: String, default: "other" },
  tags:        [String],
  status:      { type: String, enum: ["draft", "published", "archived"], default: "draft" },
  publishedAt: Date,
  views:       { type: Number, default: 0 },
  likes:       [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
}, { timestamps: true });

const ReportSchema = new mongoose.Schema({
  product:    { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  reporter:   { type: mongoose.Schema.Types.ObjectId, ref: "User",    required: true },
  category:   { type: String, required: true },
  details:    { type: String, required: true },
  status:     { type: String, enum: ["open", "under_review", "resolved"], default: "open" },
  adminNotes: String,
}, { timestamps: true });

const DonationSchema = new mongoose.Schema({
  donor:           { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  donationType:    { type: String, enum: ["funds", "resources"], required: true },
  amount:          Number,
  resourceDetails: String,
  message:         String,
}, { timestamps: true });

const CustomOrderSchema = new mongoose.Schema({
  user:               { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  orderType:          { type: String, enum: ["custom_sketch", "custom_part", "bulk_order"], required: true },
  description:        { type: String, required: true },
  sketchUrl:          { type: String, default: "" },
  status:             { type: String, enum: ["submitted", "in_discussion", "approved", "printing", "completed", "cancelled"], default: "submitted" },
  discountMultiplier: { type: Number, default: 1.0 },
  messages: [{
    sender:    { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    message:   { type: String, required: true },
    sentAt:    { type: Date, default: Date.now },
  }],
}, { timestamps: true });

// Register models (guard against OverwriteModelError on re-runs)
const User        = mongoose.models.User        || mongoose.model("User",        UserSchema);
const Product     = mongoose.models.Product     || mongoose.model("Product",     ProductSchema);
const Review      = mongoose.models.Review      || mongoose.model("Review",      ReviewSchema);
const Blog        = mongoose.models.Blog        || mongoose.model("Blog",        BlogSchema);
const Report      = mongoose.models.Report      || mongoose.model("Report",      ReportSchema);
const Donation    = mongoose.models.Donation    || mongoose.model("Donation",    DonationSchema);
const CustomOrder = mongoose.models.CustomOrder || mongoose.model("CustomOrder", CustomOrderSchema);

// ─── Wipe ─────────────────────────────────────────────────────────────────────
console.log("🗑   Clearing collections...");

// Drop every collection entirely (nukes documents AND indexes) so stale unique
// indexes like slug_1 can't cause duplicate key errors on re-seed.
const db = mongoose.connection.db;
const existingCollections = (await db.listCollections().toArray()).map(c => c.name);

await Promise.all(
  ["users", "products", "reviews", "blogs", "reports", "donations", "customorders"]
    .filter(name => existingCollections.includes(name))
    .map(name => db.collection(name).drop())
);
console.log("   ✓ Collections dropped");

// ─── Users ────────────────────────────────────────────────────────────────────
console.log("👤  Seeding users...");
const [admin, partner, curator, alice, bob, carol] = await User.create([
  {
    name: "Admin User",
    email: "admin@marketplace.dev",
    password: "Admin1234!",
    role: "admin",
    bio: "Platform administrator",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=admin",
  },
  {
    name: "Partner Corp",
    email: "partner@marketplace.dev",
    password: "Partner1234!",
    role: "partner",
    bio: "Bulk manufacturing partner",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=partner",
  },
  {
    name: "Curator Sam",
    email: "curator@marketplace.dev",
    password: "Curator1234!",
    role: "curator",
    bio: "Content curator for featured prints",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=curator",
  },
  {
    name: "Alice Student",
    email: "alice@marketplace.dev",
    password: "Alice1234!",
    role: "customer",
    bio: "Mechanical engineering student",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alice",
  },
  {
    name: "Bob Builder",
    email: "bob@marketplace.dev",
    password: "Bob1234!",
    role: "customer",
    bio: "Hobbyist maker",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=bob",
  },
  {
    name: "Carol Inactive",
    email: "carol@marketplace.dev",
    password: "Carol1234!",
    role: "customer",
    isActive: false,
    bio: "Deactivated account for testing",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=carol",
  },
]);
console.log(`   ✓ ${[admin, partner, curator, alice, bob, carol].length} users`);

// ─── Products ─────────────────────────────────────────────────────────────────
console.log("📦  Seeding products...");
const products = await Product.create([
  // approved + featured
  {
    name: "Parametric Gear Set",
    slug: "parametric-gear-set",
    description: "Fully parametric spur gear system for mechanical projects",
    category: "mechanical",
    price: 0,
    isFree: true,
    author: alice._id,
    status: "approved",
    featured: true,
    rating: 4.5,
    isPrintOfTheWeek: true,
    thumbnail: "https://via.placeholder.com/400x300?text=Gear+Set",
    modelFile: "https://files.example.com/gear-set.stl",
    availableFilaments: ["PLA", "PETG"],
    dimensions: { x: 80, y: 80, z: 20, unit: "mm" },
    groupName: "mechanical-essentials",
    attributionType: "student_group",
  },
  // approved, paid
  {
    name: "Robotic Arm Bracket",
    slug: "robotic-arm-bracket",
    description: "Lightweight bracket for small servo-driven robotic arms",
    category: "mechanical",
    price: 4.99,
    isFree: false,
    author: alice._id,
    status: "approved",
    featured: false,
    rating: 4.0,
    isPrintOfTheMonth: true,
    thumbnail: "https://via.placeholder.com/400x300?text=Robot+Bracket",
    modelFile: "https://files.example.com/robot-bracket.stl",
    availableFilaments: ["PLA", "ABS"],
    dimensions: { x: 60, y: 40, z: 30, unit: "mm" },
  },
  // approved, by partner — free home item
  {
    name: "Cable Management Clip",
    slug: "cable-management-clip",
    description: "Snap-fit cable clips for clean desk setups",
    category: "home",
    price: 0,
    isFree: true,
    author: partner._id,
    status: "approved",
    rating: 3.8,
    thumbnail: "https://via.placeholder.com/400x300?text=Cable+Clip",
    modelFile: "https://files.example.com/cable-clip.stl",
    availableFilaments: ["PLA"],
  },
  // pending (needs admin review)
  {
    name: "Drone Frame v2",
    slug: "drone-frame-v2",
    description: "250mm FPV drone frame optimised for PLA printing",
    category: "tools",
    price: 9.99,
    isFree: false,
    author: bob._id,
    status: "pending",
    thumbnail: "https://via.placeholder.com/400x300?text=Drone+Frame",
    modelFile: "https://files.example.com/drone-frame.stl",
    dimensions: { x: 250, y: 250, z: 30, unit: "mm" },
  },
  // pending
  {
    name: "Filament Dry Box Lid",
    slug: "filament-dry-box-lid",
    description: "Replacement lid for standard filament dry boxes with PTFE port",
    category: "tools",
    price: 0,
    isFree: true,
    author: bob._id,
    status: "pending",
    thumbnail: "https://via.placeholder.com/400x300?text=Dry+Box+Lid",
    modelFile: "https://files.example.com/drybox-lid.stl",
  },
  // rejected
  {
    name: "Banned Part",
    slug: "banned-part",
    description: "This listing was rejected by admin",
    category: "other",
    price: 0,
    isFree: true,
    author: alice._id,
    status: "rejected",
    adminNotes: "Does not meet quality standards",
    approvedBy: admin._id,
    approvedAt: new Date(),
    thumbnail: "https://via.placeholder.com/400x300?text=Rejected",
    modelFile: "https://files.example.com/banned.stl",
  },
]);
console.log(`   ✓ ${products.length} products`);

// Update uploadedItems
await User.findByIdAndUpdate(alice._id, {
  $push: { uploadedItems: { $each: [products[0]._id, products[1]._id, products[5]._id] } },
});
await User.findByIdAndUpdate(bob._id, {
  $push: { uploadedItems: { $each: [products[3]._id, products[4]._id] } },
});

// ─── Reviews ─────────────────────────────────────────────────────────────────
console.log("⭐  Seeding reviews...");
await Review.create([
  {
    product: products[0]._id,
    author: bob._id,
    rating: 5,
    title: "Excellent design",
    body: "Printed first try, fits perfectly.",
  },
  {
    product: products[0]._id,
    author: curator._id,
    rating: 4,
    title: "Great but needs tolerances note",
    body: "Works well on my Prusa, slight gap on Ender.",
  },
  {
    product: products[1]._id,
    author: bob._id,
    rating: 4,
    title: "Solid bracket",
    body: "Holds a MG996R no problem.",
  },
]);
console.log("   ✓ 3 reviews");

// ─── Blogs ────────────────────────────────────────────────────────────────────
console.log("📝  Seeding blogs...");
await Blog.create([
  {
    title: "Getting Started with FDM Printing for Engineering Parts",
    slug: "getting-started-fdm-printing",
    // FIX: was `body`, must be `content` to match Blog model
    content: "FDM printing is a cost-effective way to prototype mechanical components. In this guide we cover layer heights, infill strategies, and material selection for load-bearing parts.",
    excerpt: "A beginner's guide to FDM printing for engineering applications.",
    author: admin._id,
    status: "published",
    category: "guides",
    tags: ["fdm", "engineering", "beginners"],
    publishedAt: new Date("2025-01-15"),
    views: 320,
    coverImage: "https://via.placeholder.com/800x400?text=FDM+Guide",
  },
  {
    title: "Top 5 Free Mechanical Prints of 2025",
    slug: "top-5-free-mechanical-prints-2025",
    content: "We compiled the most downloaded free mechanical prints this year. From gear sets to bearing holders, here are the community favourites.",
    excerpt: "The best free mechanical prints the community loved this year.",
    author: admin._id,
    status: "published",
    category: "roundups",
    tags: ["free", "mechanical", "top5"],
    publishedAt: new Date("2025-03-10"),
    views: 512,
    coverImage: "https://via.placeholder.com/800x400?text=Top+5",
  },
  {
    title: "Upcoming: SLA Resin Support",
    slug: "upcoming-sla-resin-support",
    content: "We are working on adding resin-based prints to the marketplace. Stay tuned for the beta launch coming later this year.",
    excerpt: "SLA resin support is coming soon to the marketplace.",
    author: admin._id,
    status: "draft",
    category: "announcements",
    tags: ["sla", "resin", "upcoming"],
    coverImage: "https://via.placeholder.com/800x400?text=SLA+Draft",
  },
]);
console.log("   ✓ 3 blogs (2 published, 1 draft)");

// ─── Reports ─────────────────────────────────────────────────────────────────
console.log("🚨  Seeding reports...");
await Report.create([
  {
    product: products[1]._id,
    reporter: bob._id,
    category: "print_error",
    details: "Supports are fused to the model and cannot be removed cleanly.",
    status: "open",
  },
  {
    product: products[0]._id,
    reporter: curator._id,
    category: "copyright",
    details: "This design appears to be copied from Thingiverse user xyz123.",
    status: "under_review",
    adminNotes: "Checking original upload date",
  },
]);
console.log("   ✓ 2 reports");

// ─── Donations ────────────────────────────────────────────────────────────────
console.log("💰  Seeding donations...");
await Donation.create([
  {
    donor: alice._id,
    donationType: "funds",
    amount: 50,
    message: "Keep the free prints coming!",
  },
  {
    donor: partner._id,
    donationType: "funds",
    amount: 200,
    message: "Happy to support the community.",
  },
  {
    donor: null, // anonymous
    donationType: "funds",
    amount: 25,
    message: "Anonymous contribution",
  },
  {
    donor: bob._id,
    donationType: "resources",
    resourceDetails: "2x 1kg spools of PLA (black)",
    message: "Dropping off at the lab next Tuesday",
  },
]);
console.log("   ✓ 4 donations");

// ─── Custom Orders ────────────────────────────────────────────────────────────
console.log("🛠   Seeding custom orders...");
await CustomOrder.create([
  {
    user: alice._id,
    orderType: "custom_part",
    description: "Need a custom mounting bracket for a 52mm diameter motor",
    sketchUrl: "https://files.example.com/sketches/motor-bracket-sketch.png",
    status: "in_discussion",
    messages: [
      {
        sender: alice._id,
        message: "Order submission established. Note: Need a custom mounting bracket for a 52mm diameter motor",
      },
      {
        sender: admin._id,
        message: "Thanks! Can you confirm the bolt pattern spacing?",
      },
      {
        sender: alice._id,
        message: "It's 4x M3 bolts on a 40mm circle.",
      },
    ],
  },
  {
    user: partner._id,
    orderType: "bulk_order",
    description: "[BULK VOLUME: 500 units | Material Preference: PETG] - Cable clips for office fitout",
    status: "submitted",
    discountMultiplier: 0.85,
    messages: [
      {
        sender: partner._id,
        message: "System: Bulk order request logged for 500 units. Target deadline: 2025-06-01. Wholesale discount modifier applied: Active (15%).",
      },
    ],
  },
  {
    user: bob._id,
    orderType: "custom_part",
    description: "Replacement knob for vintage Technics amplifier",
    status: "submitted",
    messages: [
      {
        sender: bob._id,
        message: "Order submission established. Note: Replacement knob for vintage Technics amplifier",
      },
    ],
  },
]);
console.log("   ✓ 3 custom orders");

// ─── Summary ──────────────────────────────────────────────────────────────────
console.log("\n🌱  Seed complete!\n");
console.log("Test accounts (password shown in plaintext for dev use):");
console.log("┌────────────────────────────────┬──────────────────────────────┬──────────────┬──────────────┐");
console.log("│ Name                           │ Email                        │ Password     │ Role         │");
console.log("├────────────────────────────────┼──────────────────────────────┼──────────────┼──────────────┤");
console.log("│ Admin User                     │ admin@marketplace.dev        │ Admin1234!   │ admin        │");
console.log("│ Partner Corp                   │ partner@marketplace.dev      │ Partner1234! │ partner      │");
console.log("│ Curator Sam                    │ curator@marketplace.dev      │ Curator1234! │ curator      │");
console.log("│ Alice Student                  │ alice@marketplace.dev        │ Alice1234!   │ customer     │");
console.log("│ Bob Builder                    │ bob@marketplace.dev          │ Bob1234!     │ customer     │");
console.log("│ Carol Inactive (disabled)      │ carol@marketplace.dev        │ Carol1234!   │ customer     │");
console.log("└────────────────────────────────┴──────────────────────────────┴──────────────┴──────────────┘");

await mongoose.disconnect();