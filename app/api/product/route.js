import { listProducts, createProduct } from "@/controllers/productController";
import { withErrorHandling }           from "@/middleware/errorHandling";
import { requireAuth }                 from "@/middleware/requireAuth";

export const GET = withErrorHandling(async (req) => {
  const { searchParams } = new URL(req.url);

  const get  = (key) => searchParams.get(key) || undefined;
  const tags = searchParams.getAll("tags").filter(Boolean);

  const params = {
    page:          Number(get("page")  || 1),
    limit:         Number(get("limit") || 20),
    category:      get("category"),
    tags:          tags.length ? tags : undefined,
    material:      get("material"),
    difficulty:    get("difficulty"),
    minPrice:      get("minPrice"),
    maxPrice:      get("maxPrice"),
    isFree:        searchParams.has("isFree")        ? searchParams.get("isFree")        === "true" : undefined,
    isRoughSketch: searchParams.has("isRoughSketch") ? searchParams.get("isRoughSketch") === "true" : undefined,
    availability:  get("availability"),
    search:        get("search"),
    sortBy:        get("sortBy")    || "createdAt",
    sortOrder:     get("sortOrder") || "desc",
  };

  const result = await listProducts(params);
  return Response.json({ success: true, ...result });
});

export const POST = withErrorHandling(
  requireAuth(async (req, _ctx, user) => {
    const body    = await req.json();
    const product = await createProduct(body, user.id);
    return Response.json({ success: true, product }, { status: 201 });
  })
);