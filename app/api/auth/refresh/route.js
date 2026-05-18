import { refresh } from "@/controllers/authController";
import { withErrorHandling } from "@/middleware/withErrorHandling";

export const POST = withErrorHandling(refresh);
