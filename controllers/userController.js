import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Product from "@/models/Product";
import Blog from "@/models/Blog";
import Review from "@/models/Review";

// get user profile
export async function getUser(req, { params }) {
  await connectDB();
  const user = await User.findById(params.id).select("-password");
  if (!user) throw Object.assign(new Error("User not found"), { status: 404 });
  return Response.json({ success: true, user });
}

// update profile
export async function updateUser(req, { params }, user) {
  await connectDB();
  if (params.id !== user.id && user.role !== "admin")
    throw Object.assign(new Error("Forbidden"), { status: 403 });

  const { name, avatar, bio, phoneNumber } = await req.json();
  const updated = await User.findByIdAndUpdate(
    params.id,
    { name, avatar, bio, phoneNumber },
    { new: true },
  ).select("-password");
  return Response.json({ success: true, user: updated });
}

// delete option for user account
export async function deleteUser(req, { params }, user) {
  await connectDB();
  if (params.id !== user.id && user.role !== "admin")
    throw Object.assign(new Error("Forbidden"), { status: 403 });

  const userProducts = await Product.find({ author: params.id }).select("_id");
  const productIds = userProducts.map((p) => p._id);

  // Clean up reviews and items
  await Review.deleteMany({ product: { $in: productIds } });
  await Product.deleteMany({ author: params.id });
  await Blog.deleteMany({ author: params.id });

  // Handle reviews user left on other products
  const otherReviews = await Review.find({ author: params.id }).select(
    "product",
  );
  await Review.deleteMany({ author: params.id });

  // Fix ratings on those products
  const affectedProductIds = [
    ...new Set(otherReviews.map((r) => r.product.toString())),
  ];
  for (const productId of affectedProductIds) {
    const remaining = await Review.find({ product: productId });
    const avg = remaining.length
      ? remaining.reduce((sum, r) => sum + r.rating, 0) / remaining.length
      : 0;
    await Product.findByIdAndUpdate(productId, { rating: avg });
  }

  await Product.updateMany(
    {},
    { $pull: { likes: params.id, dislikes: params.id } },
  );
  await User.findByIdAndDelete(params.id);

  return Response.json({ success: true });
}
