import connectDB from "@/lib/mongodb";
import Donation from "@/models/Donation";
import { verifyToken } from "@/lib/jwt";

// record crowdfunding resources or capital metrics
export async function createDonation(req) {
  await connectDB();
  const { donationType, amount, resourceDetails, message } = await req.json();

  if (!donationType) {
    throw Object.assign(new Error("Donation properties missing"), {
      status: 400,
    });
  }

  if (donationType === "funds" && (!amount || isNaN(amount) || amount <= 0)) {
    throw Object.assign(
      new Error("A valid amount is required for fund donations"),
      { status: 400 },
    );
  }

  let donorId = null;
  const authHeader = req.headers.get("authorization");
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.replace("Bearer ", "");
    const decoded = verifyToken(token);
    if (decoded) donorId = decoded.id;
  }

  const donation = await Donation.create({
    donor: donorId,
    donationType,
    amount,
    resourceDetails,
    message,
  });

  return Response.json({ success: true, donation }, { status: 201 });
}

// view aggregated crowdfunding statistics
export async function getCrowdfundingStats(req) {
  await connectDB();
  const [fundsResult, materialCount] = await Promise.all([
    Donation.aggregate([
      { $match: { donationType: "funds" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]),
    Donation.countDocuments({ donationType: "resources" }),
  ]);

  const totalFunds = fundsResult.length > 0 ? fundsResult[0].total : 0;
  return Response.json({ success: true, totalFunds, materialCount });
}
