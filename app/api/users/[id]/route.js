import { getUser, updateUser, deleteUser } from "@/controllers/userController";
import { withErrorHandling } from "@/middleware/withErrorHandling";
import { requireAuth } from "@/middleware/requireAuth";

export const GET  = withErrorHandling(getUser);
export const PATCH = withErrorHandling(requireAuth(updateUser));
export const DELETE = withErrorHandling(requireAuth(deleteUser));
