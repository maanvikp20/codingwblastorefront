import { getUserProfile }     from "@/controllers/userController";
import { withErrorHandling }  from "@/middleware/errorHandling";

// GET /api/user/[username]
export const GET = withErrorHandling(async (_req, { params }) => {
  const user = await getUserProfile(params.username);
  return Response.json({ success: true, user });
});
