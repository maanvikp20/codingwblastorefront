import { getBlogs, createBlog } from "@/controllers/blogController";
import { withErrorHandling } from "@/middleware/errorHandling";
import { requireAdmin } from "@/middleware/requireAdmin";

export const GET = withErrorHandling(getBlogs);
export const POST = withErrorHandling(requireAdmin(createBlog));