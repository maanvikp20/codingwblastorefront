import { getRandomProduct }   from "@/controllers/productController";
import { withErrorHandling }  from "@/middleware/errorHandling";

export const GET = withErrorHandling(async (req) => {
  const { searchParams } = new URL(req.url);
  const exclude = searchParams.getAll("exclude");
  const product = await getRandomProduct(exclude);
  return Response.json({ success: true, product });
});
