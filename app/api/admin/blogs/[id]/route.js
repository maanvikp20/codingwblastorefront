import { reviewBlog } from "@/controllers/adminController";
import { withErrorHandling } from "@/middleware/errorHandling";
import { requireAdmin } from "@/middleware/requireAdmin";

export const PUT = withErrorHandling(requireAdmin(reviewBlog));