import { resetPassword } from "@/controllers/passwordController";
import { withErrorHandling } from "@/middleware/withErrorHandling";
import { rateLimit } from "@/middleware/rateLimit";

const limit = rateLimit({ maxRequests: 5, windowMs: 60000 });

export const POST = withErrorHandling(limit(resetPassword));
