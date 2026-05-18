import { setFeatured } from "@/controllers/adminController";
import { withErrorHandling } from "@/middleware/withErrorHandling";
import { requireAdmin } from "@/middleware/requireAdmin";

export const PATCH = withErrorHandling(requireAdmin(setFeatured));
