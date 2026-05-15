import { listUsers } from "@/controllers/adminController";
import { withErrorHandling } from "@/middleware/errorHandling";
import { requireAdmin } from "@/middleware/requireAdmin";

export const GET = withErrorHandling(requireAdmin(listUsers));