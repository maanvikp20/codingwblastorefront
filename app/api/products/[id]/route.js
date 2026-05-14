import { getProduct, updateProduct, deleteProduct } from "@/controllers/productController";
import { withErrorHandling } from "@/middleware/errorHandling";
import { requireAuth } from "@/middleware/requireAuth";

export const GET = withErrorHandling(getProduct);
export const PUT = withErrorHandling(requireAuth(updateProduct));
export const DELETE = withErrorHandling(requireAuth(deleteProduct));