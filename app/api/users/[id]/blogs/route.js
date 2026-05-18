import { getUserBlogs } from "@/controllers/adminController";
import { withErrorHandling } from "@/middleware/withErrorHandling";

export const GET = withErrorHandling(getUserBlogs);
