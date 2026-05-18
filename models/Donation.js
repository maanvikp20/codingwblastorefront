import mongoose from "mongoose";

const DonationSchema = new mongoose.Schema(
  {
    donor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    donationType: {
      type: String,
      enum: ["funds", "resources"],
      required: true,
    },
    amount: { type: Number, default: 0 },
    resourceDetails: {
      materialType: { type: String },
      quantity: { type: Number },
    },
    message: { type: String, max: 300 },
  },
  { timestamps: true },
);

export default mongoose.models.Donation ||
  mongoose.model("Donation", DonationSchema);
