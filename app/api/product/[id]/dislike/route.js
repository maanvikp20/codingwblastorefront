import { dislikeProduct }     from "@/controllers/productController";
import { withErrorHandling }  from "@/middleware/errorHandling";
import { requireAuth }        from "@/middleware/requireAuth";

export const POST = withErrorHandling(
  requireAuth(async (_req, { params }, user) => {
    const product = await dislikeProduct(params.id, user.id);
    return Response.json({ success: true, dislikeCount: product.dislikeCount, score: product.score });
  })
);
