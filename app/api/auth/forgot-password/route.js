import { forgotPassword } from "@/controllers/passwordResetController";
import { withErrorHandling } from "@/middleware/errorHandling";

export const POST = withErrorHandling(forgotPassword);