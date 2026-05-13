import { getProduct } from "@/controllers/productController";
import { withErrorHandling } from "@/middleware/errorHandling";
import { requireAuth } from "@/middleware/requireAuth";
import connectDB from "@/lib/MongoDB";
import Product from "@/models/Product";
import { ApiError } from "@/middleware/errorHandling";

// GET /api/product/[id]
export const GET = withErrorHandling(async (_req, { params }) => {
  const product = await getProduct(params.id);
  return Response.json({ success: true, product });
});

// PATCH /api/product/[id]  — owner or admin only
export const PATCH = withErrorHandling(
  requireAuth(async (req, { params }, user) => {
    await connectDB();
    const product = await Product.findById(params.id);
    if (!product) throw new Error("Product not found");

    if (product.creator.toString() !== user.id && user.role !== "admin") {
      throw new ApiError("Not authorised", 403);
    }

    const body = await req.json();
    // Don't allow changing status through this route (use admin route)
    delete body.status;
    Object.assign(product, body);
    await product.save();

    return Response.json({ success: true, product });
  }),
);

// DELETE /api/product/[id]
export const DELETE = withErrorHandling(
  requireAuth(async (_req, { params }, user) => {
    await connectDB();
    const product = await Product.findById(params.id);
    if (!product) throw new Error("Product not found");

    if (product.creator.toString() !== user.id && user.role !== "admin") {
      throw new ApiError("Not authorised", 403);
    }

    await product.deleteOne();
    return Response.json({ success: true, message: "Product deleted" });
  }),
);
