import { reviewProduct }      from "@/controllers/adminController";
import { withErrorHandling }  from "@/middleware/errorHandling";
import { requireAdmin }       from "@/middleware/requireAdmin";

// POST /api/admin/products/[id]/review
// body: { action: "approved" | "rejected" | "flagged", adminNotes?: string }
export const POST = withErrorHandling(
  requireAdmin(async (req, { params }, user) => {
    const { action, adminNotes } = await req.json();
    const product = await reviewProduct(params.id, user.id, action, adminNotes);
    return Response.json({ success: true, product });
  })
);
