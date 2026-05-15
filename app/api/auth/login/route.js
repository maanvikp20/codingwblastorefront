import { login } from "@/controllers/authController";
import { withErrorHandling } from "@/middleware/errorHandling";

// login user
export const POST = withErrorHandling(login);