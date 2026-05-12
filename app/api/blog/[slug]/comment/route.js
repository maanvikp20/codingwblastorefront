import { addBlogComment }     from "@/controllers/blogController";
import { withErrorHandling }  from "@/middleware/errorHandling";
import { requireAuth }        from "@/middleware/requireAuth";
import Blog                   from "@/models/Blog";
import connectDB              from "@/lib/MongoDB";
import { ApiError }           from "@/middleware/errorHandling";

export const POST = withErrorHandling(
  requireAuth(async (req, { params }, user) => {
    const { content } = await req.json();
    if (!content?.trim()) {
      return Response.json({ success: false, message: "Content required" }, { status: 400 });
    }
    // Resolve slug -> id for addBlogComment which uses id
    await connectDB();
    const post = await Blog.findOne({ slug: params.slug });
    if (!post) throw new ApiError("Post not found", 404);
    const comment = await addBlogComment(post._id, user.id, content);
    return Response.json({ success: true, comment }, { status: 201 });
  })
);
