import { likeBlog } from "@/controllers/blogController";
import { withErrorHandling } from "@/middleware/withErrorHandling";
import { requireAuth } from "@/middleware/requireAuth";

export const POST = withErrorHandling(requireAuth(likeBlog));
