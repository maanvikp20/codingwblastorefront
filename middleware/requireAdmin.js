import { getAuthUser } from "@/middleware/requireAuth";
import { ApiError } from "@/middleware/errorHandling";

export function requireAdmin(handler) {
  return async function (req, ctx) {
    const user = getAuthUser(req);
    if (user.role !== "admin") {
      throw new ApiError("Admin access required", 403);
    }
    return handler(req, ctx, user);
  };
}