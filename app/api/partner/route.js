import { listPartners, applyPartner } from "@/controllers/partnerController";
import { withErrorHandling }          from "@/middleware/errorHandling";
import { requireAuth }                from "@/middleware/requireAuth";

// GET /api/partner — public
export const GET = withErrorHandling(async (req) => {
  const { searchParams } = new URL(req.url);
  const result = await listPartners({
    page:  searchParams.get("page"),
    limit: searchParams.get("limit"),
  });
  return Response.json({ success: true, ...result });
});

// POST /api/partner — authenticated users apply
export const POST = withErrorHandling(
  requireAuth(async (req, _ctx, user) => {
    const body   = await req.json();
    const result = await applyPartner(user.id, body);
    return Response.json({ success: true, ...result }, { status: 201 });
  })
);
