import mongoose from "mongoose";

const ReportSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    reporter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: {
      type: String,
      enum: ["inappropriate", "print_error", "copyright", "other"],
      required: true,
    },
    details: { type: String, required: true, maxlength: 1000 },
    status: {
      type: String,
      enum: ["open", "under_review", "resolved"],
      default: "open",
    },
    adminNotes: { type: String, default: "" },
  },
  { timestamps: true },
);

export default mongoose.models.Report ||
  mongoose.model("Report", ReportSchema);
