import connectDB from "@/lib/MongoDB";
import User      from "@/models/User";
import Product   from "@/models/Product";
import { ApiError } from "@/middleware/errorHandling";

// List approved partners
export async function listPartners({ page = 1, limit = 20 } = {}) {
  await connectDB();

  const [partners, total] = await Promise.all([
    User.find({ role: "partner", "partnerInfo.approved": true, isActive: true })
      .select("username avatar bio partnerInfo createdAt")
      .sort({ "partnerInfo.joinedAt": -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit)),
    User.countDocuments({ role: "partner", "partnerInfo.approved": true }),
  ]);

  return { partners, total, page: Number(page), pages: Math.ceil(total / limit) };
}

// Get single partner with their products
export async function getPartner(username) {
  await connectDB();

  const partner = await User.findOne({
    username,
    role: "partner",
    "partnerInfo.approved": true,
  }).select("username avatar bio partnerInfo createdAt");

  if (!partner) throw new ApiError("Partner not found", 404);

  const products = await Product.find({ creator: partner._id, status: "approved" })
    .sort({ score: -1 })
    .limit(12)
    .select("title thumbnail price isFree availability likeCount views category");

  return { partner, products };
}

// Apply to become a partner
export async function applyPartner(userId, { companyName, website, description }) {
  await connectDB();

  const user = await User.findById(userId);
  if (!user) throw new ApiError("User not found", 404);
  if (user.role === "partner") throw new ApiError("Already a partner", 409);

  user.partnerInfo = {
    companyName,
    website,
    description,
    approved: false,
    joinedAt: null,
  };
  // Flag as pending partner (admin will approve via user role update)
  await user.save();
  return { message: "Partner application submitted — pending admin review" };
}

// Admin: approve partner (called from admin user route)
export async function approvePartner(userId) {
  await connectDB();

  const user = await User.findByIdAndUpdate(
    userId,
    {
      role: "partner",
      "partnerInfo.approved": true,
      "partnerInfo.joinedAt": new Date(),
    },
    { new: true }
  ).select("-password");

  if (!user) throw new ApiError("User not found", 404);
  return user;
}
