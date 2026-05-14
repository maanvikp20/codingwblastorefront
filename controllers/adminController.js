import connectDB from "@/lib/mongodb";
import Product from "@/models/Product";
import User from "@/models/User";
import Blog from "@/models/Blog";

// get admin dashboard stats
export async function getDashboardStats(req, ctx, user) {
  await connectDB();
  const [totalProducts, pendingProducts, totalUsers, totalBlogs, pendingBlogs] = await Promise.all([
    Product.countDocuments(),
    Product.countDocuments({ status: "pending" }),
    User.countDocuments(),
    Blog.countDocuments(),
    Blog.countDocuments({ status: "draft" }),
  ]);
  return Response.json({ success: true, totalProducts, pendingProducts, totalUsers, totalBlogs, pendingBlogs });
}

// get all pending products for review
export async function getPendingProducts(req, ctx, user) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const page  = Number(searchParams.get("page"))  || 1;
  const limit = Number(searchParams.get("limit")) || 20;

  const [products, total] = await Promise.all([
    Product.find({ status: "pending" }).populate("author", "name email").sort({ createdAt: 1 }).skip((page - 1) * limit).limit(limit),
    Product.countDocuments({ status: "pending" }),
  ]);
  return Response.json({ success: true, products, total, page, pages: Math.ceil(total / limit) });
}

// approve or reject a product listing
export async function reviewProduct(req, { params }, user) {
  await connectDB();
  const { action, adminNotes } = await req.json();
  if (!["approved", "rejected"].includes(action))
    throw Object.assign(new Error("Invalid action"), { status: 400 });

  const product = await Product.findByIdAndUpdate(
    params.id,
    { status: action, adminNotes, approvedBy: user.id, approvedAt: new Date() },
    { new: true }
  );
  if (!product) throw Object.assign(new Error("Product not found"), { status: 404 });
  return Response.json({ success: true, product });
}

// toggle product featured status
export async function setFeatured(req, { params }, user) {
  await connectDB();
  const { featured } = await req.json();
  const product = await Product.findByIdAndUpdate(params.id, { featured }, { new: true });
  if (!product) throw Object.assign(new Error("Product not found"), { status: 404 });
  return Response.json({ success: true, product });
}

// list all users with filters
export async function listUsers(req, ctx, user) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const page   = Number(searchParams.get("page"))  || 1;
  const limit  = Number(searchParams.get("limit")) || 20;
  const role   = searchParams.get("role");
  const search = searchParams.get("search");

  const query = {};
  if (role) query.role = role;
  if (search) query.$or = [
    { name:  { $regex: search, $options: "i" } },
    { email: { $regex: search, $options: "i" } },
  ];

  const [users, total] = await Promise.all([
    User.find(query).select("-password").sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
    User.countDocuments(query),
  ]);
  return Response.json({ success: true, users, total, page, pages: Math.ceil(total / limit) });
}

// change a user's role
export async function updateUserRole(req, { params }) {
  await connectDB();
  const { role } = await req.json();
  if (!["customer", "curator", "admin"].includes(role))
    throw Object.assign(new Error("Invalid role"), { status: 400 });

  const user = await User.findByIdAndUpdate(params.id, { role }, { new: true }).select("-password");
  if (!user) throw Object.assign(new Error("User not found"), { status: 404 });
  return Response.json({ success: true, user });
}

// enable or disable a user account
export async function toggleUserActive(req, { params }) {
  await connectDB();
  const user = await User.findById(params.id);
  if (!user) throw Object.assign(new Error("User not found"), { status: 404 });
  user.isActive = !user.isActive;
  await user.save();
  return Response.json({ success: true, isActive: user.isActive });
}

// get all products uploaded by a specific user
export async function getUserProducts(req, { params }) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const page  = Number(searchParams.get("page"))  || 1;
  const limit = Number(searchParams.get("limit")) || 20;

  const [products, total] = await Promise.all([
    Product.find({ author: params.id }).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
    Product.countDocuments({ author: params.id }),
  ]);
  return Response.json({ success: true, products, total, page, pages: Math.ceil(total / limit) });
}

// get all blogs written by a specific user
export async function getUserBlogs(req, { params }) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const page  = Number(searchParams.get("page"))  || 1;
  const limit = Number(searchParams.get("limit")) || 20;

  const [blogs, total] = await Promise.all([
    Blog.find({ author: params.id }).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit),
    Blog.countDocuments({ author: params.id }),
  ]);
  return Response.json({ success: true, blogs, total, page, pages: Math.ceil(total / limit) });
}

// admin review to publish or archive a blog
export async function reviewBlog(req, { params }, user) {
  await connectDB();
  const { action } = await req.json();
  if (!["published", "archived"].includes(action))
    throw Object.assign(new Error("Invalid action"), { status: 400 });

  const update = { status: action };
  if (action === "published") update.publishedAt = new Date();

  const blog = await Blog.findByIdAndUpdate(params.id, update, { new: true });
  if (!blog) throw Object.assign(new Error("Blog not found"), { status: 404 });
  return Response.json({ success: true, blog });
}