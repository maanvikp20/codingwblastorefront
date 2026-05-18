import { getUserProducts } from "@/controllers/adminController";
import { withErrorHandling } from "@/middleware/withErrorHandling";
import { requireAdmin } from "@/middleware/requireAdmin";

export const GET = withErrorHandling(requireAdmin(getUserProducts));
