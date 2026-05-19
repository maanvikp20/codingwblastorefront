import { verifyToken } from "@/lib/jwt";

// helper to get user from headers
export function getAuthUser(req) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader) throw Object.assign(new Error("Unauthorized"), { status: 401 });

  const token = authHeader.replace("Bearer ", "");
  const decoded = verifyToken(token);

  if (!decoded) throw Object.assign(new Error("Invalid or expired token"), { status: 401 });

  return { id: decoded.id, email: decoded.email, role: decoded.role };
}

// protect routes for logged in users
export function requireAuth(handler) {
  return async (req, ctx) => {
    const user = getAuthUser(req);
    return handler(req, ctx, user);
  };
}