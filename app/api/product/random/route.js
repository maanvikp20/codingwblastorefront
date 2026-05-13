import { getRandomProduct }   from "@/controllers/productController";
import { withErrorHandling }  from "@/middleware/errorHandling";

export const GET = withErrorHandling(async (req) => {
  const { searchParams } = new URL(req.url);
  const exclude = searchParams.getAll("exclude");
  const product = await getRandomProduct(exclude);
  if (!product) {
    return Response.json(
      { success: false, message: "No approved products in the database yet. Run: node scripts/seed.js" },
      { status: 404 }
    );
  }
  return Response.json({ success: true, product });
});