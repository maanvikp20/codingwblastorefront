import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import User from "@/models/User";

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
  const sort = searchParams.get("sort") || "newest";

  const query = { status: "approved" };
  if (category) query.category = category;
  if (search) query.$text = { $search: search };
  if (featured === "true") query.featured = true;
  if (isFree === "true") query.isFree = true;
  if (minRating) query.rating = { $gte: Number(minRating) };

  const sortMap = {
    newest: { createdAt: -1 },
    oldest: { createdAt: 1 },
    "top-rated": { rating: -1 },
    "most-purchased": { totalPurchases: -1 },
  };

  const [products, total] = await Promise.all([
    Product.find(query)
      .populate("author", "name avatar")
      .sort(sortMap[sort] || sortMap.newest)
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
  return Response.json({ success: true, likes: updated.likes.length });
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
  buyer.rewardPoints = (buyer.rewardPoints || 0) + 10;
  product.totalPurchases = (product.totalPurchases || 0) + 1;

  await Promise.all([buyer.save(), product.save()]);
  return Response.json({ success: true, rewardPoints: buyer.rewardPoints });
}
