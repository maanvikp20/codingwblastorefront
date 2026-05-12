import { getDashboardStats }  from "@/controllers/adminController";
import { withErrorHandling }  from "@/middleware/errorHandling";
import { requireAdmin }       from "@/middleware/requireAdmin";

export const GET = withErrorHandling(
  requireAdmin(async () => {
    const stats = await getDashboardStats();
    return Response.json({ success: true, stats });
  })
);
