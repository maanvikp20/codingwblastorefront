import { getAuthUser } from "@/middleware/requireAuth";

// ensure user is an admin
export function requireAdmin(handler) {
  return async (req, ctx) => {
    const user = getAuthUser(req);
    if (user.role !== "admin") {
      throw Object.assign(new Error("Admin access required"), { status: 403 });
    }
    return handler(req, ctx, user);
  };
}