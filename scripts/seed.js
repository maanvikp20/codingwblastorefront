import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, "../.env.local") });

import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error("❌  MONGODB_URI not set — make sure .env.local exists in the project root");
  process.exit(1);
}

const UserSchema = new mongoose.Schema(
  {
    username:    String,
    email:       String,
    password:    String,
    role:        { type: String, default: "user" },
    avatar:      { type: String, default: "" },
    bio:         { type: String, default: "" },
    isActive:    { type: Boolean, default: true },
    partnerInfo: {
      companyName:  String,
      website:      String,
      description:  String,
      approved:     { type: Boolean, default: false },
      joinedAt:     Date,
    },
    dislikedProducts: [mongoose.Schema.Types.ObjectId],
    likedProducts:    [mongoose.Schema.Types.ObjectId],
    viewedProducts:   [mongoose.Schema.Types.ObjectId],
    donations:        { type: Array, default: [] },
    lastLogin:        Date,
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  if (this.isModified("password")) this.password = await bcrypt.hash(this.password, 12);
  next();
});

const ProductSchema = new mongoose.Schema(
  {
    title:         String,
    slug:          String,
    description:   String,
    creator:       mongoose.Schema.Types.ObjectId,
    images:        [String],
    thumbnail:     String,
    category:      String,
    tags:          [String],
    material:      String,
    difficulty:    String,
    price:         { type: Number, default: 0 },
    isFree:        { type: Boolean, default: true },
    status:        { type: String, default: "approved" },
    featured:      { type: Boolean, default: false },
    isPrintOfDay:  { type: Boolean, default: false },
    isRoughSketch: { type: Boolean, default: false },
    likes:         [mongoose.Schema.Types.ObjectId],
    dislikes:      [mongoose.Schema.Types.ObjectId],
    likeCount:     { type: Number, default: 0 },
    dislikeCount:  { type: Number, default: 0 },
    score:         { type: Number, default: 0 },
    views:         { type: Number, default: 0 },
    comments:      { type: Array, default: [] },
    reports:       { type: Array, default: [] },
    reportCount:   { type: Number, default: 0 },
    availability: {
      status: { type: String, default: "available" },
      stock:  { type: Number, default: null },
    },
    crowdfunding: {
      enabled: { type: Boolean, default: false },
      goal:    { type: Number, default: 0 },
      raised:  { type: Number, default: 0 },
      backers: { type: Number, default: 0 },
    },
    donations: { type: Array, default: [] },
  },
  { timestamps: true }
);

const BlogSchema = new mongoose.Schema(
  {
    title:       String,
    slug:        String,
    author:      mongoose.Schema.Types.ObjectId,
    content:     String,
    excerpt:     String,
    coverImage:  String,
    category:    { type: String, default: "other" },
    tags:        [String],
    status:      { type: String, default: "published" },
    publishedAt: Date,
    views:       { type: Number, default: 0 },
    likes:       [mongoose.Schema.Types.ObjectId],
    comments:    { type: Array, default: [] },
    relatedProducts: [mongoose.Schema.Types.ObjectId],
  },
  { timestamps: true }
);

const User    = mongoose.models.User    || mongoose.model("User",    UserSchema);
const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema);
const Blog    = mongoose.models.Blog    || mongoose.model("Blog",    BlogSchema);

function makeSlug(title) {
  return title.toLowerCase().replace(/[^a-z0-9 -]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");
}

const PRODUCTS = [
  {
    title: "Benchy Boat",
    slug: "benchy-boat",
    description: "The classic 3D printing benchmark — a miniature tugboat that tests overhangs, bridges, and curves.",
    category: "benchmark", tags: ["benchmark", "boat", "beginner"],
    material: "PLA", difficulty: "easy", price: 0, isFree: true,
    featured: true, isPrintOfDay: true,
    thumbnail: "https://placehold.co/400x300/2563eb/ffffff?text=Benchy",
  },
  {
    title: "Articulated Dragon",
    slug: "articulated-dragon",
    description: "A fully articulated dragon that prints in place — no assembly required.",
    category: "figurine", tags: ["dragon", "articulated", "print-in-place"],
    material: "PETG", difficulty: "medium", price: 0, isFree: true,
    thumbnail: "https://placehold.co/400x300/7c3aed/ffffff?text=Dragon",
  },
  {
    title: "Cable Management Clips",
    slug: "cable-management-clips",
    description: "Stackable desk cable clips — fits cables up to 8mm.",
    category: "utility", tags: ["desk", "cable", "utility"],
    material: "PLA", difficulty: "easy", price: 0, isFree: true,
    thumbnail: "https://placehold.co/400x300/059669/ffffff?text=Clips",
  },
  {
    title: "Hollow Dodecahedron Lamp Shade",
    slug: "hollow-dodecahedron-lamp-shade",
    description: "Geometric lamp shade with pentagonal facets. Pairs with an E27 bulb holder.",
    category: "home decor", tags: ["lamp", "geometric", "decor"],
    material: "PLA", difficulty: "medium", price: 2.99, isFree: false,
    thumbnail: "https://placehold.co/400x300/d97706/ffffff?text=Lamp",
  },
  {
    title: "Low-Poly Bulbasaur Planter",
    slug: "low-poly-bulbasaur-planter",
    description: "Low-poly Bulbasaur with a hollow top perfect for a small succulent.",
    category: "planter", tags: ["pokemon", "planter", "low-poly"],
    material: "PLA", difficulty: "easy", price: 0, isFree: true,
    thumbnail: "https://placehold.co/400x300/16a34a/ffffff?text=Planter",
  },
  {
    title: "Parametric Gear Cube",
    slug: "parametric-gear-cube",
    description: "All six faces are spinning gears that interlock. No supports needed.",
    category: "mechanical", tags: ["gear", "mechanical", "fidget"],
    material: "PLA", difficulty: "hard", price: 0, isFree: true,
    thumbnail: "https://placehold.co/400x300/dc2626/ffffff?text=Gear+Cube",
  },
  {
    title: "Phone Stand (Adjustable Angle)",
    slug: "phone-stand-adjustable-angle",
    description: "Adjustable angle phone stand with a friction hinge.",
    category: "utility", tags: ["phone", "stand", "desk"],
    material: "PETG", difficulty: "easy", price: 0, isFree: true,
    thumbnail: "https://placehold.co/400x300/0891b2/ffffff?text=Phone+Stand",
  },
  {
    title: "Rough Sketch: Wall Mount Bracket",
    slug: "rough-sketch-wall-mount-bracket",
    description: "Early prototype of a universal wall mount bracket. Feedback welcome.",
    category: "utility", tags: ["bracket", "wall-mount", "wip"],
    material: "PLA", difficulty: "easy", price: 0, isFree: true,
    isRoughSketch: true,
    thumbnail: "https://placehold.co/400x300/64748b/ffffff?text=Sketch",
  },
];

const BLOGS = [
  {
    title:      "Getting Started with FDM Printing",
    slug:       "getting-started-with-fdm-printing",
    content:    "FDM (Fused Deposition Modeling) is the most common type of 3D printing for hobbyists. In this guide we cover bed leveling, first layer calibration, and choosing the right filament for your project.",
    excerpt:    "Everything you need to know to get your first FDM print to stick.",
    category:   "tutorial",
    tags:       ["fdm", "beginner", "calibration"],
    status:     "published",
    publishedAt: new Date("2024-10-01"),
  },
  {
    title:      "Top 5 Dragon Prints of 2024",
    slug:       "top-5-dragon-prints-2024",
    content:    "Dragons are one of the most popular categories on any 3D print marketplace. Here are our top five picks from this year, ranging from tabletop miniatures to full display pieces.",
    excerpt:    "Our favourite dragon models from the community this year.",
    category:   "showcase",
    tags:       ["dragon", "showcase", "community"],
    status:     "published",
    publishedAt: new Date("2024-11-15"),
  },
  {
    title:      "How to Store Your Filament",
    slug:       "how-to-store-your-filament",
    content:    "Moisture is the enemy of quality prints. Learn how to use airtight containers, desiccant packs, and filament dryers to keep your spools in perfect condition.",
    excerpt:    "Keep your filament dry and your prints clean.",
    category:   "tips",
    tags:       ["filament", "storage", "tips"],
    status:     "published",
    publishedAt: new Date("2024-12-01"),
  },
];

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log("✅  Connected to MongoDB");

  await User.deleteMany({ email: { $in: ["seed@3dstore.dev", "partner@3dstore.dev"] } });
  console.log("🧹  Cleared old seed users");

  const admin = new User({
    username: "seeduser",
    email:    "seed@3dstore.dev",
    password: "Password123!",
    role:     "admin",
  });
  await admin.save();
  console.log("👤  Admin: seed@3dstore.dev / Password123!");

  const partner = new User({
    username: "seedpartner",
    email:    "partner@3dstore.dev",
    password: "Password123!",
    role:     "partner",
    partnerInfo: {
      companyName:  "Seed Partner Co",
      website:      "https://seedpartner.dev",
      description:  "Official seed partner for testing.",
      approved:     true,
      joinedAt:     new Date(),
    },
  });
  await partner.save();
  console.log("🤝  Partner: partner@3dstore.dev / Password123!");

  await Product.deleteMany({ creator: { $in: [admin._id, partner._id] } });
  console.log("🧹  Cleared old seed products");

  const productDocs = PRODUCTS.map((p) => ({ ...p, creator: admin._id }));
  const inserted    = await Product.insertMany(productDocs);
  console.log(`📦  Inserted ${inserted.length} products`);
  inserted.forEach((p) =>
    console.log(`   • [${p.status}] ${p.isRoughSketch ? "✏️  sketch" : "✅ "} ${p.title}`)
  );

  await Blog.deleteMany({ author: admin._id });
  console.log("🧹  Cleared old seed blogs");

  const blogDocs = BLOGS.map((b) => ({ ...b, author: admin._id }));
  const blogs    = await Blog.insertMany(blogDocs);
  console.log(`📝  Inserted ${blogs.length} blog posts`);
  blogs.forEach((b) => console.log(`   • [${b.status}] ${b.title}`));

  await mongoose.disconnect();
  console.log("\n🎉  Seed complete.");
}

seed().catch((err) => {
  console.error("❌  Seed failed:", err);
  process.exit(1);
});