import { getFeaturedConfig, updateFeaturedConfig } from "@/controllers/adminController";
import { withErrorHandling } from "@/middleware/withErrorHandling";
import { requireAdmin } from "@/middleware/requireAdmin";

export const GET   = withErrorHandling(requireAdmin(getFeaturedConfig));
export const PATCH = withErrorHandling(requireAdmin(updateFeaturedConfig));
