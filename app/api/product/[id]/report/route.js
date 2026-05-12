import { reportProduct }      from "@/controllers/productController";
import { withErrorHandling }  from "@/middleware/errorHandling";
import { requireAuth }        from "@/middleware/requireAuth";

export const POST = withErrorHandling(
  requireAuth(async (req, { params }, user) => {
    const { reason, details } = await req.json();
    if (!reason) {
      return Response.json({ success: false, message: "Reason required" }, { status: 400 });
    }
    const result = await reportProduct(params.id, user.id, { reason, details });
    return Response.json({ success: true, ...result });
  })
);
