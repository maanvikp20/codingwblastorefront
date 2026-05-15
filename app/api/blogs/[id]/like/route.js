import { likeBlog } from "@/controllers/blogController";
import { withErrorHandling } from "@/middleware/errorHandling";
import { requireAuth } from "@/middleware/requireAuth";

export const POST = withErrorHandling(requireAuth(likeBlog));