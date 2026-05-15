import { getMe } from "@/controllers/authController";
import { withErrorHandling } from "@/middleware/errorHandling";
import { requireAuth } from "@/middleware/requireAuth";

export const GET = withErrorHandling(requireAuth(getMe));