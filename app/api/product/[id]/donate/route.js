import { donateToProduct }    from "@/controllers/productController";
import { withErrorHandling }  from "@/middleware/errorHandling";
import { requireAuth }        from "@/middleware/requireAuth";

export const POST = withErrorHandling(
  requireAuth(async (req, { params }, user) => {
    const body   = await req.json();
    const result = await donateToProduct(params.id, user.id, body);
    return Response.json({ success: true, crowdfunding: result });
  })
);
