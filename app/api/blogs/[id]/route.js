import { getBlog, updateBlog, deleteBlog } from "@/controllers/blogController";
import { withErrorHandling } from "@/middleware/withErrorHandling";
import { requireAdmin } from "@/middleware/requireAdmin";

export const GET    = withErrorHandling(getBlog);
export const PATCH  = withErrorHandling(requireAdmin(updateBlog));
export const DELETE = withErrorHandling(requireAdmin(deleteBlog));
