import { promoteSketch }      from "@/controllers/sketchController";
import { withErrorHandling }  from "@/middleware/errorHandling";
import { requireAuth }        from "@/middleware/requireAuth";

// POST /api/sketch/[id]/promote
export const POST = withErrorHandling(
  requireAuth(async (_req, { params }, user) => {
    const sketch = await promoteSketch(params.id, user.id, user.role);
    return Response.json({ success: true, sketch });
  })
);
