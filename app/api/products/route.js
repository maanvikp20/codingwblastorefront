import { getProducts, createProduct } from "@/controllers/productController";
import { withErrorHandling } from "@/middleware/withErrorHandling";
import { requireAuth } from "@/middleware/requireAuth";

export const GET  = withErrorHandling(getProducts);
export const POST = withErrorHandling(requireAuth(createProduct));
