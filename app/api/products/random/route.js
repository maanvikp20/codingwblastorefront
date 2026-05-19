import { getRandomProduct } from "@/controllers/productController";
import { withErrorHandling } from "@/middleware/withErrorHandling";

export const GET = withErrorHandling(getRandomProduct);
