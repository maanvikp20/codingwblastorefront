import { setPrintOfDay }      from "@/controllers/adminController";
import { withErrorHandling }  from "@/middleware/errorHandling";
import { requireAdmin }       from "@/middleware/requireAdmin";

// POST /api/admin/products/[id]/print-of-day
export const POST = withErrorHandling(
  requireAdmin(async (_req, { params }) => {
    const product = await setPrintOfDay(params.id);
    return Response.json({ success: true, product });
  })
);
