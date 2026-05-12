import connectDB from "@/lib/MongoDB";
import User      from "@/models/User";
import Product   from "@/models/Product";
import { ApiError } from "@/middleware/errorHandling";

// Get public profile
export async function getUserProfile(username) {
  await connectDB();
  const user = await User.findOne({ username }).select(
    "-password -dislikedProducts -donations"
  );
  if (!user) throw new ApiError("User not found", 404);
  return user;
}

// Update own profile
export async function updateProfile(userId, { username, bio, avatar }) {
  await connectDB();

  const update = {};
  if (username !== undefined) update.username = username;
  if (bio       !== undefined) update.bio      = bio;
  if (avatar    !== undefined) update.avatar   = avatar;

  const user = await User.findByIdAndUpdate(userId, update, {
    new:          true,
    runValidators: true,
  }).select("-password");

  if (!user) throw new ApiError("User not found", 404);
  return user;
}

// Get recommendations (exclude disliked categories/tags)
export async function getRecommendations(userId, { page = 1, limit = 20 } = {}) {
  await connectDB();

  const user = await User.findById(userId).populate("dislikedProducts");
  if (!user) throw new ApiError("User not found", 404);

  // Build a set of tags/categories from disliked products to avoid
  const dislikedTags       = new Set();
  const dislikedCategories = new Set();
  const dislikedIds        = user.dislikedProducts.map((p) => p._id);

  for (const p of user.dislikedProducts) {
    (p.tags || []).forEach((t) => dislikedTags.add(t));
    if (p.category) dislikedCategories.add(p.category);
  }

  // Prefer liked tags/categories
  const likedProducts = await Product.find({ _id: { $in: user.likedProducts } }).select("tags category");
  const likedTags       = new Set();
  const likedCategories = new Set();
  for (const p of likedProducts) {
    (p.tags || []).forEach((t) => likedTags.add(t));
    if (p.category) likedCategories.add(p.category);
  }

  const mustAvoid = {
    _id:      { $nin: [...dislikedIds, ...user.viewedProducts] },
    status:   "approved",
    tags:     { $nin: [...dislikedTags] },
    category: { $nin: [...dislikedCategories] },
  };

  const [products, total] = await Promise.all([
    Product.find(mustAvoid)
      .sort({ score: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))
      .populate("creator", "username avatar"),
    Product.countDocuments(mustAvoid),
  ]);

  return { products, total };
}