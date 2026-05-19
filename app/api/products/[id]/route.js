import { getProduct, updateProduct, deleteProduct } from "@/controllers/productController";
import { withErrorHandling } from "@/middleware/withErrorHandling";
import { requireAuth } from "@/middleware/requireAuth";

export const GET    = withErrorHandling(getProduct);
export const PATCH  = withErrorHandling(requireAuth(updateProduct));
export const DELETE = withErrorHandling(requireAuth(deleteProduct));
