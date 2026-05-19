import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, select: false },
    phoneNumber: { type: String },
    avatar: { type: String, default: "" },
    bio: { type: String, default: "" },
    role: {
      type: String,
      enum: ["customer", "curator", "partner", "admin"],
      default: "customer",
    },
    isActive: { type: Boolean, default: true },
    lastLogin: { type: Date },

    uploadedItems: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    previousPurchases: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    ],

    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],

    passwordResetToken: { type: String, select: false },
    passwordResetExpires: { type: Date, select: false },
  },
  { timestamps: true },
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

UserSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

UserSchema.methods.toSafeObject = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export default mongoose.models.User || mongoose.model("User", UserSchema);
