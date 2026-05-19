import { getMyCustomOrders, createCustomOrder } from "@/controllers/customOrderController";
import { withErrorHandling } from "@/middleware/withErrorHandling";
import { requireAuth } from "@/middleware/requireAuth";

export const GET  = withErrorHandling(requireAuth(getMyCustomOrders));
export const POST = withErrorHandling(requireAuth(createCustomOrder));