import { updateUserRole, toggleUserActive } from "@/controllers/adminController";
import { withErrorHandling }               from "@/middleware/errorHandling";
import { requireAdmin }                    from "@/middleware/requireAdmin";

// PATCH /api/admin/users/[id]
// body: { role?: string, toggleActive?: true }
export const PATCH = withErrorHandling(
  requireAdmin(async (req, { params }) => {
    const { role, toggleActive } = await req.json();

    if (toggleActive) {
      const user = await toggleUserActive(params.id);
      return Response.json({ success: true, user });
    }

    if (role) {
      const user = await updateUserRole(params.id, role);
      return Response.json({ success: true, user });
    }

    return Response.json({ success: false, message: "Nothing to update" }, { status: 400 });
  })
);
