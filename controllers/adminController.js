import connectDB from "@/lib/MongoDB";
import Product from "@/models/Product";
import User from "@/models/User";
import Blog from "@/models/Blog";
import { ApiError } from "@/middleware/errorHandling";

// Dashboard Stats
export async function getDashboardStats() {
  await connectDB();

  const [
    totalProducts,
    pendingProducts,
    totalUsers,
    totalBlogs,
    flaggedProducts,
    pendingReports,
  ] = await Promise.all([
    Product.countDocuments(),
    Product.countDocuments({ status: "pending" }),
    User.countDocuments(),
    Blog.countDocuments(),
    Product.countDocuments({ status: "flagged" }),
    Product.countDocuments({ "reports.status": "pending" }),
  ]);

  return {
    totalProducts,
    pendingProducts,
    totalUsers,
    totalBlogs,
    flaggedProducts,
    pendingReports,
  };
}

// Approve / Reject Product
export async function reviewProduct(
  productId,
  adminId,
  action,
  adminNotes = "",
) {
  await connectDB();

  const product = await Product.findById(productId);
  if (!product) throw new Error("Product not found");

  if (!["approved", "rejected", "flagged"].includes(action)) {
    throw new ApiError("Invalid action", 400);
  }

  product.status = action;
  product.adminNotes = adminNotes;
  product.approvedBy = adminId;
  product.approvedAt = new Date();
  await product.save();

  return product;
}

// Get Pending Products
export async function getPendingProducts({ page = 1, limit = 20 } = {}) {
  await connectDB();

  const [products, total] = await Promise.all([
    Product.find({ status: "pending" })
      .populate("creator", "username email avatar")
      .sort({ createdAt: 1 })
      .skip((page - 1) * limit)
      .limit(Number(limit)),
    Product.countDocuments({ status: "pending" }),
  ]);

  return {
    products,
    total,
    page: Number(page),
    pages: Math.ceil(total / limit),
  };
}

// Feature / Un-feature Product
export async function setFeatured(productId, featured) {
  await connectDB();
  const product = await Product.findByIdAndUpdate(
    productId,
    { featured: Boolean(featured) },
    { new: true },
  );
  if (!product) throw new Error("Product not found");
  return product;
}

// Set Print of Day
export async function setPrintOfDay(productId) {
  await connectDB();

  // Clear existing print-of-day
  await Product.updateMany({ isPrintOfDay: true }, { isPrintOfDay: false });

  const product = await Product.findByIdAndUpdate(
    productId,
    { isPrintOfDay: true, printOfDayDate: new Date() },
    { new: true },
  );
  if (!product) throw new Error("Product not found");
  return product;
}

// Get Reports ────────────────────────────────────────────────────────────
export async function getReports({
  page = 1,
  limit = 20,
  status = "pending",
} = {}) {
  await connectDB();

  // Aggregate products that have reports matching the given status
  const products = await Product.find({ "reports.status": status })
    .select("title reports creator status")
    .populate("creator", "username email")
    .populate("reports.reporter", "username email")
    .sort({ reportCount: -1 })
    .skip((page - 1) * limit)
    .limit(Number(limit));

  const total = await Product.countDocuments({ "reports.status": status });
  return {
    products,
    total,
    page: Number(page),
    pages: Math.ceil(total / limit),
  };
}

// Resolve Report
export async function resolveReport(productId, reportId, adminId, resolution) {
  await connectDB();

  const product = await Product.findById(productId);
  if (!product) throw new Error("Product not found");

  const report = product.reports.id(reportId);
  if (!report) throw new ApiError("Report not found", 404);

  report.status = resolution; // "reviewed" | "dismissed" | "actioned"
  report.reviewedBy = adminId;
  report.reviewedAt = new Date();

  if (resolution === "actioned") {
    product.status = "flagged";
  }

  await product.save();
  return product;
}

// Manage Users
export async function listUsers({ page = 1, limit = 20, role, search } = {}) {
  await connectDB();

  const query = {};
  if (role) query.role = role;
  if (search) {
    query.$or = [
      { username: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }

  const [users, total] = await Promise.all([
    User.find(query)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit)),
    User.countDocuments(query),
  ]);

  return { users, total, page: Number(page), pages: Math.ceil(total / limit) };
}

export async function updateUserRole(userId, role) {
  await connectDB();
  const user = await User.findByIdAndUpdate(
    userId,
    { role },
    { new: true },
  ).select("-password");
  if (!user) throw new ApiError("User not found", 404);
  return user;
}

export async function toggleUserActive(userId) {
  await connectDB();
  const user = await User.findById(userId);
  if (!user) throw new ApiError("User not found", 404);
  user.isActive = !user.isActive;
  await user.save();
  return user;
}
