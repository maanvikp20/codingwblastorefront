import connectDB  from "@/lib/MongoDB";
import User       from "@/models/User";
import { withErrorHandling } from "@/middleware/errorHandling";
import { requireAuth }       from "@/middleware/requireAuth";
import { ApiError }          from "@/middleware/errorHandling";

// GET /api/donation — get logged-in user's donation history
export const GET = withErrorHandling(
  requireAuth(async (_req, _ctx, user) => {
    await connectDB();
    const u = await User.findById(user.id)
      .select("donations")
      .populate("donations.productId", "title thumbnail");
    if (!u) throw new ApiError("User not found", 404);
    return Response.json({ success: true, donations: u.donations });
  })
);
