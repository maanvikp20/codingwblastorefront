import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js";
import Product from "../models/Product.js";
import Blog from "../models/Blog.js";
import Review from "../models/Review.js";

dotenv.config({ path: ".env.local" });

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to DB... Cleaning up...");

    //Clear existing data
    await Promise.all([
      User.deleteMany(),
      Product.deleteMany(),
      Blog.deleteMany(),
      Review.deleteMany(),
    ]);

    // Create Users
    const admin = await User.create({
      name: "Admin User",
      email: "admin@test.com",
      password: "password123",
      role: "admin",
    });

    const curator = await User.create({
      name: "Pro Creator",
      email: "curator@test.com",
      password: "password123",
      role: "curator",
    });

    // Create a Product
    const product = await Product.create({
      name: "Test STL Model",
      description: "A high-quality 3D print file.",
      price: 10,
      category: "figurines",
      author: curator._id,
      status: "approved",
    });

    // Create a Blog
    await Blog.create({
      title: "How to 3D Print",
      content: "Step 1: Buy a printer...",
      author: admin._id,
      status: "published",
      publishedAt: new Date(),
    });

    console.log("Database Seeded! 🌱");
    console.log("Admin: admin@test.com / password123");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedData();