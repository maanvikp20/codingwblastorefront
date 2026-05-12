import { listSketches, createSketch } from "@/controllers/sketchController";
import { withErrorHandling }          from "@/middleware/errorHandling";
import { requireAuth }                from "@/middleware/requireAuth";

// GET /api/sketch
export const GET = withErrorHandling(async (req) => {
  const { searchParams } = new URL(req.url);
  const result = await listSketches({
    page:     searchParams.get("page"),
    limit:    searchParams.get("limit"),
    category: searchParams.get("category"),
  });
  return Response.json({ success: true, ...result });
});

// POST /api/sketch
export const POST = withErrorHandling(
  requireAuth(async (req, _ctx, user) => {
    const body   = await req.json();
    const sketch = await createSketch(body, user.id);
    return Response.json({ success: true, sketch }, { status: 201 });
  })
);
