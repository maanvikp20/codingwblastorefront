import mongoose from "mongoose";

const CustomOrderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    orderType: {
      type: String,
      enum: ["custom_sketch", "bulk_order"],
      required: true,
    },
    description: { type: String, required: true },
    sketchUrl: { type: String },
    status: {
      type: String,
      enum: [
        "submitted",
        "in_discussion",
        "approved",
        "printing",
        "completed",
        "cancelled",
      ],
      default: "submitted",
    },

    messages: [
      {
        sender: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        message: { type: String, required: true },
        sentAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true },
);

export default mongoose.models.CustomOrder ||
  mongoose.model("CustomOrder", CustomOrderSchema);
