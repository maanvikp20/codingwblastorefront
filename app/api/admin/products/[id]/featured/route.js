import { setFeatured }        from "@/controllers/adminController";
import { withErrorHandling }  from "@/middleware/errorHandling";
import { requireAdmin }       from "@/middleware/requireAdmin";

// PATCH /api/admin/products/[id]/featured
// body: { featured: true | false }
export const PATCH = withErrorHandling(
  requireAdmin(async (req, { params }) => {
    const { featured } = await req.json();
    const product = await setFeatured(params.id, featured);
    return Response.json({ success: true, product });
  })
);
