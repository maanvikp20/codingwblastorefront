import { listUsers }          from "@/controllers/adminController";
import { withErrorHandling }  from "@/middleware/errorHandling";
import { requireAdmin }       from "@/middleware/requireAdmin";

export const GET = withErrorHandling(
  requireAdmin(async (req) => {
    const { searchParams } = new URL(req.url);
    const result = await listUsers({
      page:   searchParams.get("page"),
      limit:  searchParams.get("limit"),
      role:   searchParams.get("role"),
      search: searchParams.get("search"),
    });
    return Response.json({ success: true, ...result });
  })
);
