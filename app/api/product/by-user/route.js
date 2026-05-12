import { getProductsByUser }  from "@/controllers/productController";
import { withErrorHandling }  from "@/middleware/errorHandling";

// GET /api/product/by-user?username=xxx&page=1&limit=20
export const GET = withErrorHandling(async (req) => {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get("username");
  if (!username) {
    return Response.json({ success: false, message: "username required" }, { status: 400 });
  }

  const result = await getProductsByUser(username, {
    page:  searchParams.get("page"),
    limit: searchParams.get("limit"),
  });

  return Response.json({ success: true, ...result });
});
