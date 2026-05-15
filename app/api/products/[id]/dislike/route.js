import { dislikeProduct } from "@/controllers/productController";
import { withErrorHandling } from "@/middleware/errorHandling";
import { requireAuth } from "@/middleware/requireAuth";

export const POST = withErrorHandling(requireAuth(dislikeProduct));