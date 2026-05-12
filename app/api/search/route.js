import connectDB from "@/lib/MongoDB";
import Product   from "@/models/Product";
import Blog      from "@/models/Blog";
import User      from "@/models/User";
import { withErrorHandling } from "@/middleware/errorHandling";

// GET /api/search?q=xxx&type=all|products|blogs|users&page=1&limit=10
export const GET = withErrorHandling(async (req) => {
  const { searchParams } = new URL(req.url);
  const q     = searchParams.get("q")?.trim();
  const type  = searchParams.get("type") || "all";
  const page  = Number(searchParams.get("page")  || 1);
  const limit = Number(searchParams.get("limit") || 10);

  if (!q || q.length < 2) {
    return Response.json({ success: false, message: "Query must be at least 2 characters" }, { status: 400 });
  }

  await connectDB();
  const results = {};

  if (type === "all" || type === "products") {
    results.products = await Product.find(
      { $text: { $search: q }, status: "approved" },
      { score: { $meta: "textScore" } }
    )
      .sort({ score: { $meta: "textScore" } })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("creator", "username avatar")
      .select("title description thumbnail category tags price isFree availability creator");
  }

  if (type === "all" || type === "blogs") {
    results.blogs = await Blog.find(
      { $text: { $search: q }, status: "published" },
      { score: { $meta: "textScore" } }
    )
      .sort({ score: { $meta: "textScore" } })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate("author", "username avatar")
      .select("title slug excerpt coverImage category publishedAt author");
  }

  if (type === "all" || type === "users") {
    // For users, do a regex match on username (text index not ideal for usernames)
    const regex = new RegExp(q, "i");
    results.users = await User.find({
      $or: [{ username: regex }, { "partnerInfo.companyName": regex }],
      isActive: true,
    })
      .skip((page - 1) * limit)
      .limit(limit)
      .select("username avatar bio role partnerInfo.companyName");
  }

  return Response.json({ success: true, query: q, ...results });
});
