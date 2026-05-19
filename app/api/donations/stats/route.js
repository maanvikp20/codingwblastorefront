import { getCrowdfundingStats } from "@/controllers/donationController";
import { withErrorHandling } from "@/middleware/withErrorHandling";

export const GET = withErrorHandling(getCrowdfundingStats);
