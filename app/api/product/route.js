import { listProducts, createProduct } from "@/controllers/productController";
import { withErrorHandling }           from "@/middleware/errorHandling";
import { requireAuth }                 from "@/middleware/requireAuth";

// GET /api/product  — public, supports filters via query params
export const GET = withErrorHandling(async (req) => {
  const { searchParams } = new URL(req.url);

  const params = {
    page:          searchParams.get("page")         || 1,
    limit:         searchParams.get("limit")        || 20,
    category:      searchParams.get("category"),
    tags:          searchParams.getAll("tags"),
    material:      searchParams.get("material"),
    difficulty:    searchParams.get("difficulty"),
    minPrice:      searchParams.get("minPrice"),
    maxPrice:      searchParams.get("maxPrice"),
    isFree:        searchParams.get("isFree") !== null ? searchParams.get("isFree") === "true" : undefined,
    isRoughSketch: searchParams.get("isRoughSketch") !== null ? searchParams.get("isRoughSketch") === "true" : undefined,
    availability:  searchParams.get("availability"),
    search:        searchParams.get("search"),
    sortBy:        searchParams.get("sortBy"),
    sortOrder:     searchParams.get("sortOrder"),
  };

  const result = await listProducts(params);
  return Response.json({ success: true, ...result });
});

// POST /api/product  — authenticated users only
export const POST = withErrorHandling(
  requireAuth(async (req, _ctx, user) => {
    const body    = await req.json();
    const product = await createProduct(body, user.id);
    return Response.json({ success: true, product }, { status: 201 });
  })
);
