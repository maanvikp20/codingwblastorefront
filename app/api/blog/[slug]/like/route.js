import { likeBlogPost }       from "@/controllers/blogController";
import { withErrorHandling }  from "@/middleware/errorHandling";
import { requireAuth }        from "@/middleware/requireAuth";
import Blog                   from "@/models/Blog";
import connectDB              from "@/lib/MongoDB";
import { ApiError }           from "@/middleware/errorHandling";

export const POST = withErrorHandling(
  requireAuth(async (_req, { params }, user) => {
    await connectDB();
    const post = await Blog.findOne({ slug: params.slug });
    if (!post) throw new ApiError("Post not found", 404);
    const result = await likeBlogPost(post._id, user.id);
    return Response.json({ success: true, ...result });
  })
);
