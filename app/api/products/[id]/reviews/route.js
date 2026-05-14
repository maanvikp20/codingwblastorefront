import { getReviews, addReview } from "@/controllers/reviewController";
import { withErrorHandling } from "@/middleware/errorHandling";
import { requireAuth } from "@/middleware/requireAuth";

export const GET = withErrorHandling(getReviews);
export const POST = withErrorHandling(requireAuth(addReview));