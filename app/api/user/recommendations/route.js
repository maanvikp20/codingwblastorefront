import { getRecommendations } from "@/controllers/userController";
import { withErrorHandling }  from "@/middleware/errorHandling";
import { requireAuth }        from "@/middleware/requireAuth";

// GET /api/user/recommendations
export const GET = withErrorHandling(
  requireAuth(async (req, _ctx, user) => {
    const { searchParams } = new URL(req.url);
    const result = await getRecommendations(user.id, {
      page:  searchParams.get("page"),
      limit: searchParams.get("limit"),
    });
    return Response.json({ success: true, ...result });
  })
);
