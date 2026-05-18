import { trackProductInteraction } from "@/controllers/productController";
import { withErrorHandling } from "@/middleware/withErrorHandling";

export const POST = withErrorHandling(trackProductInteraction);
