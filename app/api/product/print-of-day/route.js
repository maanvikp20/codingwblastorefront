import { getPrintOfDay }      from "@/controllers/productController";
import { withErrorHandling }  from "@/middleware/errorHandling";

export const GET = withErrorHandling(async () => {
  const product = await getPrintOfDay();
  return Response.json({ success: true, product });
});
