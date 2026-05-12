import { resolveReport }      from "@/controllers/adminController";
import { withErrorHandling }  from "@/middleware/errorHandling";
import { requireAdmin }       from "@/middleware/requireAdmin";

// PATCH /api/admin/reports/[productId]/[reportId]
// body: { resolution: "reviewed" | "dismissed" | "actioned" }
export const PATCH = withErrorHandling(
  requireAdmin(async (req, { params }, user) => {
    const { resolution } = await req.json();
    const product = await resolveReport(params.productId, params.reportId, user.id, resolution);
    return Response.json({ success: true, product });
  })
);
