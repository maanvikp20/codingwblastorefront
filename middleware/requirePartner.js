import { getAuthUser } from "@/middleware/requireAuth";

// ensure user is a partner or an admin
export function requirePartner(handler) {
  return async (req, ctx) => {
    const user = getAuthUser(req);
    if (user.role !== "partner" && user.role !== "admin") {
      throw Object.assign(new Error("Partner or Admin access required"), { status: 403 });
    }
    return handler(req, ctx, user);
  };
}