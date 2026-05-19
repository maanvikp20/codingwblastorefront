import { addOrderMessage } from "@/controllers/customOrderController";
import { withErrorHandling } from "@/middleware/withErrorHandling";
import { requireAuth } from "@/middleware/requireAuth";

export const POST = withErrorHandling(requireAuth(addOrderMessage));