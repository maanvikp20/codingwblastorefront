import {
  updateUserRole,
  toggleUserActive,
  getUserProducts,
  getUserBlogs,
} from "@/controllers/adminController";
import { withErrorHandling } from "@/middleware/errorHandling";
import { requireAdmin } from "@/middleware/requireAdmin";

// Combined GET to handle both products and blogs
export const GET = withErrorHandling(
  requireAdmin((req, ctx, user) => {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");
    if (type === "blogs") return getUserBlogs(req, ctx, user);
    return getUserProducts(req, ctx, user);
  }),
);

export const PUT = withErrorHandling(requireAdmin(updateUserRole));
export const PATCH = withErrorHandling(requireAdmin(toggleUserActive));
