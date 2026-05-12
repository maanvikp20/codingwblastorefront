import { addComment, deleteComment } from "@/controllers/productController";
import { withErrorHandling }         from "@/middleware/errorHandling";
import { requireAuth }               from "@/middleware/requireAuth";

// POST /api/product/[id]/comment
export const POST = withErrorHandling(
  requireAuth(async (req, { params }, user) => {
    const { content } = await req.json();
    if (!content?.trim()) {
      return Response.json({ success: false, message: "Content required" }, { status: 400 });
    }
    const comment = await addComment(params.id, user.id, content);
    return Response.json({ success: true, comment }, { status: 201 });
  })
);

// DELETE /api/product/[id]/comment?commentId=xxx
export const DELETE = withErrorHandling(
  requireAuth(async (req, { params }, user) => {
    const { searchParams } = new URL(req.url);
    const commentId = searchParams.get("commentId");
    if (!commentId) {
      return Response.json({ success: false, message: "commentId required" }, { status: 400 });
    }
    const result = await deleteComment(params.id, commentId, user.id, user.role);
    return Response.json({ success: true, ...result });
  })
);
