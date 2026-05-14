import { refresh } from "@/controllers/authController";
import { withErrorHandling } from "@/middleware/errorHandling";

export const POST = withErrorHandling(refresh);