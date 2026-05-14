import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema(
  {
    name:         { type: String, required: true, trim: true },
    email:        { type: String, required: true, unique: true, lowercase: true },
    password:     { type: String, required: true, select: false },
    phoneNumber:  { type: String },
    avatar:       { type: String, default: "" },
    bio:          { type: String, default: "" },
    role:         { type: String, enum: ["customer", "curator", "admin"], default: "customer" },
    isActive:     { type: Boolean, default: true },
    lastLogin:    { type: Date },

    // Curator items
    uploadedItems: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],

    // Customer items
    previousPurchases: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    rewardPoints:      { type: Number, default: 0 },
    likes:             [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    dislikes:          [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],

    // Password recovery
    passwordResetToken:   { type: String, select: false },
    passwordResetExpires: { type: Date,   select: false },
  },
  { timestamps: true }
);

// Hash password before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password
UserSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

// Safe user object
UserSchema.methods.toSafeObject = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export default mongoose.models.User || mongoose.model("User", UserSchema);