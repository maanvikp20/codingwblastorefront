import { register } from "@/controllers/authController";
import { withErrorHandling } from "@/middleware/errorHandling";

// register new user
export const POST = withErrorHandling(register);