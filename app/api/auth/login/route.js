import { login } from "@/controllers/authController";
import { withErrorHandling } from "@/middleware/withErrorHandling";
import { rateLimit } from "@/middleware/rateLimit";

const limit = rateLimit({ maxRequests: 10, windowMs: 60000 });

export const POST = withErrorHandling(limit(login));
