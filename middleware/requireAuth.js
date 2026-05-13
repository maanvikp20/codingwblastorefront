import { verifyToken } from "@/lib/jwt";
import { ApiError } from "@/middleware/errorHandling";

export function getAuthUser(req) {
  const authHeader =
    req.headers.get("authorization") ||
    req.headers.get("Authorization");

  if (!authHeader) throw new ApiError("Unauthorized", 401);

  const token = authHeader.replace("Bearer ", "");
  const decoded = verifyToken(token);

  if (!decoded) throw new ApiError("Unauthorized", 401);

  return {
    id: decoded.id,
    email: decoded.email,
    role: decoded.role,
  };
}

export function requireAuth(handler) {
  return async (req, ctx) => {
    const user = getAuthUser(req);
    return handler(req, ctx, user);
  };
}