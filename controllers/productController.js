import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import User from "@/models/User";
import Report from "@/models/Report";
import { verifyToken } from "@/lib/jwt";

// get products with filters and sorting
export async function getProducts(req) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const page = Number(searchParams.get("page")) || 1;
  const limit = Number(searchParams.get("limit")) || 20;
  const category = searchParams.get("category");
  const search = searchParams.get("search");
  const featured = searchParams.get("featured");
  const isFree = searchParams.get("isFree");
  const minRating = searchParams.get("minRating");
  const groupName = searchParams.get("groupName");
  const timeframe = searchParams.get("timeframe");
  const sort = searchParams.get("sort") || "newest";

  const query = { status: "approved" };
  if (category) query.category = category;
  if (search) query.$text = { $search: search };
  if (featured === "true") query.featured = true;
  if (isFree === "true") query.isFree = true;
  if (minRating) query.rating = { $gte: Number(minRating) };
  if (groupName) query.groupName = groupName;

  // Curation duration windows
  if (timeframe) {
    if (timeframe === "day") query.isPrintOfTheDay = true;
    if (timeframe === "week") query.isPrintOfTheWeek = true;
    if (timeframe === "month") query.isPrintOfTheMonth = true;
  }

  const sortMap = {
    newest: { createdAt: -1 },
    oldest: { createdAt: 1 },
    "top-rated": { rating: -1 },
    "most-purchased": { totalPurchases: -1 },
  };

  const [products, total] = await Promise.all([
    Product.find(query)
      .populate("author", "name avatar")
      .sort(
        search
          ? { score: { $meta: "textScore" } }
          : sortMap[sort] || sortMap.newest,
      )
      .skip((page - 1) * limit)
      .limit(limit),
    Product.countDocuments(query),
  ]);

  return Response.json({
    success: true,
    products,
    total,
    page,
    pages: Math.ceil(total / limit),
  });
}

// get one product
export async function getProduct(req, { params }) {
  await connectDB();
  const product = await Product.findById(params.id)
    .populate("author", "name avatar")
    .populate("reviews");
  if (!product)
    throw Object.assign(new Error("Product not found"), { status: 404 });
  return Response.json({ success: true, product });
}

// get a random print using custom filter definitions
export async function getRandomProduct(req) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");

  // Filter out products the user has disliked if they are authenticated
  let excludedProductIds = [];
  const authHeader = req.headers.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.replace("Bearer ", "");
    const decoded = verifyToken(token);
    if (decoded) {
      const user = await User.findById(decoded.id).select("dislikes");
      if (user && user.dislikes.length > 0) {
        excludedProductIds = user.dislikes;
      }
    }
  }

  const matchQuery = { status: "approved" };
  if (category) matchQuery.category = category;
  if (excludedProductIds.length > 0) {
    matchQuery._id = { $nin: excludedProductIds };
  }

  // Draw 1 random sample using MongoDB aggregation
  const randomItems = await Product.aggregate([
    { $match: matchQuery },
    { $sample: { size: 1 } },
  ]);

  if (randomItems.length === 0) {
    throw Object.assign(new Error("No items match query metrics"), {
      status: 404,
    });
  }

  return Response.json({ success: true, product: randomItems[0] });
}

// create product
export async function createProduct(req, ctx, user) {
  await connectDB();
  const body = await req.json();
  const product = await Product.create({ ...body, author: user.id });

  await User.findByIdAndUpdate(user.id, {
    $push: { uploadedItems: product._id },
  });
  return Response.json({ success: true, product }, { status: 201 });
}

// update product
export async function updateProduct(req, { params }, user) {
  await connectDB();
  const product = await Product.findById(params.id);
  if (!product)
    throw Object.assign(new Error("Product not found"), { status: 404 });

  if (product.author.toString() !== user.id && user.role !== "admin")
    throw Object.assign(new Error("Forbidden"), { status: 403 });

  const body = await req.json();
  Object.assign(product, body);
  await product.save();
  return Response.json({ success: true, product });
}

// delete product and clean up references
export async function deleteProduct(req, { params }, user) {
  await connectDB();
  const product = await Product.findById(params.id);
  if (!product)
    throw Object.assign(new Error("Product not found"), { status: 404 });

  if (product.author.toString() !== user.id && user.role !== "admin")
    throw Object.assign(new Error("Forbidden"), { status: 403 });

  await product.deleteOne();

  await User.updateMany(
    {},
    {
      $pull: {
        uploadedItems: product._id,
        likes: product._id,
        dislikes: product._id,
      },
    },
  );
  return Response.json({ success: true });
}

// like product
export async function likeProduct(req, { params }, user) {
  await connectDB();
  const product = await Product.findById(params.id);
  if (!product)
    throw Object.assign(new Error("Product not found"), { status: 404 });

  const isLiked = product.likes.includes(user.id);
  const update = isLiked
    ? { $pull: { likes: user.id } }
    : { $addToSet: { likes: user.id }, $pull: { dislikes: user.id } };

  const updated = await Product.findByIdAndUpdate(params.id, update, {
    new: true,
  });

  await User.findByIdAndUpdate(user.id, update);
  return Response.json({ success: true, likes: updated.likes.length });
}

// dislike product
export async function dislikeProduct(req, { params }, user) {
  await connectDB();
  const product = await Product.findById(params.id);
  if (!product)
    throw Object.assign(new Error("Product not found"), { status: 404 });

  const isDisliked = product.dislikes.includes(user.id);
  const update = isDisliked
    ? { $pull: { dislikes: user.id } }
    : { $addToSet: { dislikes: user.id }, $pull: { likes: user.id } };

  const updated = await Product.findByIdAndUpdate(params.id, update, {
    new: true,
  });

  await User.findByIdAndUpdate(user.id, update); // SYNC TO CLIENT PROFILE
  return Response.json({ success: true, dislikes: updated.dislikes.length });
}

// report an item for content or printer errors
export async function reportProduct(req, { params }, user) {
  await connectDB();
  const { category, details } = await req.json();

  if (!category || !details) {
    throw Object.assign(new Error("Category and details required"), {
      status: 400,
    });
  }

  const report = await Report.create({
    product: params.id,
    reporter: user.id,
    category,
    details,
  });

  return Response.json({ success: true, report }, { status: 201 });
}

// purchase logic
export async function purchaseProduct(req, { params }, user) {
  await connectDB();
  const product = await Product.findById(params.id);

  if (!product || product.status !== "approved")
    throw Object.assign(new Error("Product unavailable"), { status: 400 });

  const buyer = await User.findById(user.id);
  if (!buyer) throw Object.assign(new Error("User not found"), { status: 404 });

  buyer.previousPurchases.push(product._id);
  product.totalPurchases = (product.totalPurchases || 0) + 1;

  await Promise.all([buyer.save(), product.save()]);
  return Response.json({
    success: true,
    message: "Purchase completed successfully",
  });
}

// register a product interaction
export async function trackProductInteraction(req, { params }) {
  await connectDB();
  const { interactionType } = await req.json();

  if (!interactionType) {
    throw Object.assign(new Error("Interaction type is required"), { status: 400 });
  }

  const product = await Product.findById(params.id);
  if (!product) {
    throw Object.assign(new Error("Product not found"), { status: 404 });
  }

  const update = {};
  if (interactionType === "view") update.$inc = { views: 1 };
  if (interactionType === "share") update.$inc = { shares: 1 };
  if (interactionType === "3d_preview") update.$inc = { previewClicks: 1 };

  if (Object.keys(update).length > 0) {
    await Product.findByIdAndUpdate(params.id, update);
  }

  return Response.json({ 
    success: true, 
    message: `Interaction '${interactionType}' recorded successfully.` 
  });
}