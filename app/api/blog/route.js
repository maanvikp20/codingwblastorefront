import { listBlogPosts, createBlogPost } from "@/controllers/blogController";
import { withErrorHandling }             from "@/middleware/errorHandling";
import { requireAuth }                   from "@/middleware/requireAuth";

export const GET = withErrorHandling(async (req) => {
  const { searchParams } = new URL(req.url);
  const result = await listBlogPosts({
    page:     searchParams.get("page"),
    limit:    searchParams.get("limit"),
    category: searchParams.get("category"),
    search:   searchParams.get("search"),
  });
  return Response.json({ success: true, ...result });
});

export const POST = withErrorHandling(
  requireAuth(async (req, _ctx, user) => {
    const body = await req.json();
    const post = await createBlogPost(body, user.id);
    return Response.json({ success: true, post }, { status: 201 });
  })
);
