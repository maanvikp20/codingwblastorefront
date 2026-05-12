import { updateAvailability } from "@/controllers/productController";
import { withErrorHandling }  from "@/middleware/errorHandling";
import { requireAuth }        from "@/middleware/requireAuth";

export const PATCH = withErrorHandling(
  requireAuth(async (req, { params }, user) => {
    const data   = await req.json();
    const result = await updateAvailability(params.id, user.id, user.role, data);
    return Response.json({ success: true, availability: result.availability });
  })
);
