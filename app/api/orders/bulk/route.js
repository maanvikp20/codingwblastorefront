import { createBulkOrder } from "@/controllers/customOrderController";
import { withErrorHandling } from "@/middleware/withErrorHandling";
import { requireAuth } from "@/middleware/requireAuth";

// Partners get a 15% discount (handled in controller); all logged-in users can submit
export const POST = withErrorHandling(requireAuth(createBulkOrder));