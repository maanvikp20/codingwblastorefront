import { getMe }              from "@/controllers/authController";
import { updateProfile, getRecommendations } from "@/controllers/userController";
import { withErrorHandling }  from "@/middleware/errorHandling";
import { requireAuth }        from "@/middleware/requireAuth";

// GET /api/user/me
export const GET = withErrorHandling(
  requireAuth(async (_req, _ctx, user) => {
    const me = await getMe(user.id);
    return Response.json({ success: true, user: me });
  })
);

// PATCH /api/user/me
export const PATCH = withErrorHandling(
  requireAuth(async (req, _ctx, user) => {
    const data    = await req.json();
    const updated = await updateProfile(user.id, data);
    return Response.json({ success: true, user: updated });
  })
);
