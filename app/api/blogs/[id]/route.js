import { getBlog, updateBlog, deleteBlog } from "@/controllers/blogController";
import { withErrorHandling } from "@/middleware/errorHandling";
import { requireAdmin } from "@/middleware/requireAdmin";

export const GET = withErrorHandling(getBlog);
export const PUT = withErrorHandling(requireAdmin(updateBlog));
export const DELETE = withErrorHandling(requireAdmin(deleteBlog));