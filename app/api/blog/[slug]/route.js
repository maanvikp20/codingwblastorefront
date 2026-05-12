import { getBlogPost, updateBlogPost, deleteBlogPost } from "@/controllers/blogController";
import { withErrorHandling }                           from "@/middleware/errorHandling";
import { requireAuth }                                 from "@/middleware/requireAuth";

export const GET = withErrorHandling(async (_req, { params }) => {
  const post = await getBlogPost(params.slug);
  return Response.json({ success: true, post });
});

export const PATCH = withErrorHandling(
  requireAuth(async (req, { params }, user) => {
    const data = await req.json();
    const post = await updateBlogPost(params.slug, user.id, user.role, data);
    return Response.json({ success: true, post });
  })
);

export const DELETE = withErrorHandling(
  requireAuth(async (_req, { params }, user) => {
    const result = await deleteBlogPost(params.slug, user.id, user.role);
    return Response.json({ success: true, ...result });
  })
);
