import { NextResponse } from "next/server";
import { verifyToken }  from "@/lib/jwt";

export function middleware(req) {
  const { pathname } = req.nextUrl;

  // Protect all /api/admin/* routes at the edge
  if (pathname.startsWith("/api/admin")) {
    const authHeader = req.headers.get("authorization") || "";
    const token      = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

    if (!token) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json({ success: false, message: "Invalid token" }, { status: 401 });
    }

    if (decoded.role !== "admin") {
      return NextResponse.json({ success: false, message: "Forbidden" }, { status: 403 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/admin/:path*"],
};
