import connectDB from "@/lib/MongoDB";
import Product   from "@/models/Product";
import User      from "@/models/User";
import { ApiError } from "@/middleware/errorHandling";

export async function createProduct(data, userId) {
  await connectDB();

  const slug = data.title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");

  const product = await Product.create({
    ...data,
    slug,
    creator: userId,
    status: "pending",
  });

  return product;
}

// Get single product
export async function getProduct(productId) {
  await connectDB();
  const product = await Product.findById(productId)
    .populate("creator", "username avatar")
    .populate("comments.author", "username avatar");
  if (!product) throw new ApiError("Product not found", 404);

  // increment view count
  await Product.findByIdAndUpdate(productId, { $inc: { views: 1 } });
  return product;
}

// List / Filter Products
export async function listProducts({
  page = 1,
  limit = 20,
  category,
  tags,
  material,
  difficulty,
  minPrice,
  maxPrice,
  isFree,
  isRoughSketch,
  availability,
  search,
  sortBy = "createdAt",
  sortOrder = "desc",
} = {}) {
  await connectDB();

  const query = { status: "approved" };

  if (category)     query.category    = category;
  if (material)     query.material    = material;
  if (difficulty)   query.difficulty  = difficulty;
  if (isFree !== undefined) query.isFree = isFree;
  if (isRoughSketch !== undefined) query.isRoughSketch = isRoughSketch;
  if (availability) query["availability.status"] = availability;
  if (tags && (!Array.isArray(tags) || tags.length > 0)) {
    const tagArr = Array.isArray(tags) ? tags : [tags];
    if (tagArr.length > 0) query.tags = { $in: tagArr };
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    query.price = {};
    if (minPrice !== undefined) query.price.$gte = Number(minPrice);
    if (maxPrice !== undefined) query.price.$lte = Number(maxPrice);
  }

  let useTextSearch = !!search;
  if (search) {
    query.$text = { $search: search };
  }

  const sortDir   = sortOrder === "asc" ? 1 : -1;
  const sortField = { [sortBy]: sortDir };

  let products, total;
  try {
    [products, total] = await Promise.all([
      Product.find(query)
        .populate("creator", "username avatar")
        .sort(sortField)
        .skip((page - 1) * limit)
        .limit(Number(limit)),
      Product.countDocuments(query),
    ]);
  } catch (err) {
    if (err.message?.includes("text index") && search) {
      delete query.$text;
      query.$or = [
        { title:       { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { tags:        { $regex: search, $options: "i" } },
      ];
      [products, total] = await Promise.all([
        Product.find(query)
          .populate("creator", "username avatar")
          .sort(sortField)
          .skip((page - 1) * limit)
          .limit(Number(limit)),
        Product.countDocuments(query),
      ]);
    } else {
      throw err;
    }
  }

  return { products, total, page: Number(page), pages: Math.ceil(total / limit) };
}

// Random Print
export async function getRandomProduct(excludeIds = []) {
  await connectDB();
  const count = await Product.countDocuments({
    status: "approved",
    _id: { $nin: excludeIds },
  });
  if (count === 0) {
    return null;
  }

  const skip    = Math.floor(Math.random() * count);
  const product = await Product.findOne({
    status: "approved",
    _id: { $nin: excludeIds },
  })
    .skip(skip)
    .populate("creator", "username avatar");

  return product;
}

// Dislike Algorithm
export async function dislikeProduct(productId, userId) {
  await connectDB();

  const product = await Product.findById(productId);
  if (!product) throw new ApiError("Product not found", 404);

  const alreadyDisliked = product.dislikes.includes(userId);
  const alreadyLiked    = product.likes.includes(userId);

  if (alreadyDisliked) {
    // Toggle off dislike
    product.dislikes.pull(userId);
    await User.findByIdAndUpdate(userId, { $pull: { dislikedProducts: productId } });
  } else {
    product.dislikes.addToSet(userId);
    if (alreadyLiked) product.likes.pull(userId);
    await User.findByIdAndUpdate(userId, {
      $addToSet: { dislikedProducts: productId },
      $pull:     { likedProducts: productId },
    });
  }

  await product.save(); // triggers score recalculation in pre-save hook
  return product;
}

// Like Product
export async function likeProduct(productId, userId) {
  await connectDB();

  const product = await Product.findById(productId);
  if (!product) throw new ApiError("Product not found", 404);

  const alreadyLiked    = product.likes.includes(userId);
  const alreadyDisliked = product.dislikes.includes(userId);

  if (alreadyLiked) {
    product.likes.pull(userId);
    await User.findByIdAndUpdate(userId, { $pull: { likedProducts: productId } });
  } else {
    product.likes.addToSet(userId);
    if (alreadyDisliked) product.dislikes.pull(userId);
    await User.findByIdAndUpdate(userId, {
      $addToSet: { likedProducts: productId },
      $pull:     { dislikedProducts: productId },
    });
  }

  await product.save();
  return product;
}

// Print of the Day
export async function getPrintOfDay() {
  await connectDB();

  // Check if one was already set today
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  let print = await Product.findOne({
    isPrintOfDay: true,
    printOfDayDate: { $gte: startOfDay },
    status: "approved",
  }).populate("creator", "username avatar");

  // If none set for today, pick the highest-scored product not recently featured
  if (!print) {
    print = await Product.findOne({ status: "approved" })
      .sort({ score: -1, views: -1 })
      .populate("creator", "username avatar");

    if (print) {
      await Product.findByIdAndUpdate(print._id, {
        isPrintOfDay: true,
        printOfDayDate: new Date(),
      });
    }
  }

  return print;
}

// Add Comment
export async function addComment(productId, userId, content) {
  await connectDB();

  const product = await Product.findById(productId);
  if (!product) throw new ApiError("Product not found", 404);

  product.comments.push({ author: userId, content });
  await product.save();

  const updated = await Product.findById(productId).populate(
    "comments.author",
    "username avatar"
  );
  return updated.comments[updated.comments.length - 1];
}

// Delete Comment
export async function deleteComment(productId, commentId, userId, role) {
  await connectDB();

  const product = await Product.findById(productId);
  if (!product) throw new ApiError("Product not found", 404);

  const comment = product.comments.id(commentId);
  if (!comment) throw new ApiError("Comment not found", 404);

  if (comment.author.toString() !== userId && role !== "admin") {
    throw new ApiError("Not authorised", 403);
  }

  comment.isDeleted = true;
  comment.content   = "[deleted]";
  await product.save();
  return { message: "Comment deleted" };
}

// Report Product
export async function reportProduct(productId, userId, { reason, details }) {
  await connectDB();

  const product = await Product.findById(productId);
  if (!product) throw new ApiError("Product not found", 404);

  // Prevent duplicate reports from same user
  const alreadyReported = product.reports.some(
    (r) => r.reporter.toString() === userId
  );
  if (alreadyReported) throw new ApiError("Already reported", 409);

  product.reports.push({ reporter: userId, reason, details });
  await product.save();
  return { message: "Report submitted" };
}

// Update Availability
export async function updateAvailability(productId, userId, role, data) {
  await connectDB();

  const product = await Product.findById(productId);
  if (!product) throw new ApiError("Product not found", 404);

  if (product.creator.toString() !== userId && role !== "admin") {
    throw new ApiError("Not authorised", 403);
  }

  product.availability = { ...product.availability.toObject(), ...data };
  await product.save();
  return product;
}

// Donate / Fund
export async function donateToProduct(productId, userId, { amount, message, anonymous, stripePaymentIntentId }) {
  await connectDB();

  const product = await Product.findById(productId);
  if (!product) throw new ApiError("Product not found", 404);
  if (!product.crowdfunding.enabled) throw new ApiError("Crowdfunding not enabled for this product", 400);

  product.donations.push({ donor: userId, amount, message, anonymous, stripePaymentIntentId });
  product.crowdfunding.raised  += amount;
  product.crowdfunding.backers += 1;
  await product.save();
  return product.crowdfunding;
}

// Search by User
export async function getProductsByUser(username, { page = 1, limit = 20 } = {}) {
  await connectDB();

  const user = await User.findOne({ username });
  if (!user) throw new ApiError("User not found", 404);

  const [products, total] = await Promise.all([
    Product.find({ creator: user._id, status: "approved" })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit)),
    Product.countDocuments({ creator: user._id, status: "approved" }),
  ]);

  return { products, user, total, page: Number(page), pages: Math.ceil(total / limit) };
}