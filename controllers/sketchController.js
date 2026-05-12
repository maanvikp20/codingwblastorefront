import connectDB from "@/lib/MongoDB";
import Product   from "@/models/Product";
import { ApiError } from "@/middleware/errorHandling";

// Create a rough sketch / rough print listing
export async function createSketch(data, userId) {
  await connectDB();
  const sketch = await Product.create({
    ...data,
    creator:       userId,
    isRoughSketch: true,
    status:        "pending",   // still needs admin approval
    isFree:        data.isFree ?? true,
  });
  return sketch;
}

// List rough sketches
export async function listSketches({ page = 1, limit = 20, category } = {}) {
  await connectDB();

  const query = { isRoughSketch: true, status: "approved" };
  if (category) query.category = category;

  const [sketches, total] = await Promise.all([
    Product.find(query)
      .populate("creator", "username avatar")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit)),
    Product.countDocuments(query),
  ]);

  return { sketches, total, page: Number(page), pages: Math.ceil(total / limit) };
}

// Convert a rough sketch into a full product
export async function promoteSketch(sketchId, userId, role) {
  await connectDB();

  const sketch = await Product.findById(sketchId);
  if (!sketch) throw new ApiError("Sketch not found", 404);
  if (!sketch.isRoughSketch) throw new ApiError("Product is not a rough sketch", 400);

  if (sketch.creator.toString() !== userId && role !== "admin") {
    throw new ApiError("Not authorised", 403);
  }

  sketch.isRoughSketch = false;
  sketch.status        = "pending";  // re-queue for admin review as full product
  await sketch.save();
  return sketch;
}
