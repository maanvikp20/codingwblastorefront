import { getPartner }         from "@/controllers/partnerController";
import { withErrorHandling }  from "@/middleware/errorHandling";

// GET /api/partner/[username]
export const GET = withErrorHandling(async (_req, { params }) => {
  const result = await getPartner(params.username);
  return Response.json({ success: true, ...result });
});
