import { getUser, updateUser, deleteUser } from "@/controllers/userController";
import { withErrorHandling } from "@/middleware/errorHandling";
import { requireAuth } from "@/middleware/requireAuth";

export const GET = withErrorHandling(getUser);
export const PUT = withErrorHandling(requireAuth(updateUser));
export const DELETE = withErrorHandling(requireAuth(deleteUser));