import { getReports }         from "@/controllers/adminController";
import { withErrorHandling }  from "@/middleware/errorHandling";
import { requireAdmin }       from "@/middleware/requireAdmin";

export const GET = withErrorHandling(
  requireAdmin(async (req) => {
    const { searchParams } = new URL(req.url);
    const result = await getReports({
      page:   searchParams.get("page"),
      limit:  searchParams.get("limit"),
      status: searchParams.get("status") || "pending",
    });
    return Response.json({ success: true, ...result });
  })
);
