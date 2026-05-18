import { createDonation } from "@/controllers/donationController";
import { withErrorHandling } from "@/middleware/withErrorHandling";

// Auth is optional here — controller handles it internally via verifyToken
export const POST = withErrorHandling(createDonation);
