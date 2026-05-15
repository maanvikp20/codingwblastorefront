import connectDB from "@/lib/mongodb";
import Review from "@/models/Review";
import Product from "@/models/Product";

// get all reviews for a product
export async function getReviews(req, { params }) {
  await connectDB();
  const reviews = await Review.find({ product: params.id }).populate("author", "name avatar");
  return Response.json({ success: true, reviews });
}

// add a review and update average rating
export async function addReview(req, { params }, user) {
  await connectDB();
  const { rating, title, body } = await req.json();

  const existing = await Review.findOne({ product: params.id, author: user.id });
  if (existing) throw Object.assign(new Error("Already reviewed"), { status: 400 });

  await Review.create({ product: params.id, author: user.id, rating, title, body });

  // Recalculate average
  const reviews = await Review.find({ product: params.id });
  const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  await Product.findByIdAndUpdate(params.id, { rating: avg });

  return Response.json({ success: true });
}