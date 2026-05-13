import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, "../.env.local") });

import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI not set");
  process.exit(1);
}

/* ------------------ Schemas ------------------ */

const UserSchema = new mongoose.Schema({}, { strict: false });
const ProductSchema = new mongoose.Schema({}, { strict: false });

const User =
  mongoose.models.User || mongoose.model("User", UserSchema);

const Product =
  mongoose.models.Product || mongoose.model("Product", ProductSchema);

/* ------------------ Reset Script ------------------ */

async function resetDB() {
  try {
    await mongoose.connect(MONGODB_URI);

    console.log("✅ Connected to MongoDB");

    // Delete EVERYTHING
    await User.deleteMany({});
    console.log("🧹 Deleted all users");

    await Product.deleteMany({});
    console.log("🧹 Deleted all products");

    // OPTIONAL:
    // reset all collections entirely
    // await mongoose.connection.dropDatabase();

    console.log("🎉 Database reset complete");

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("❌ Reset failed:", err);
    process.exit(1);
  }
}

resetDB();