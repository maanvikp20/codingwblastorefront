import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    email:    { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, select: false },
    role:     { type: String, enum: ["user", "partner", "admin"], default: "user" },
    avatar:   { type: String, default: "" },
    bio:      { type: String, default: "" },

    // Partner-specific
    partnerInfo: {
      companyName:  { type: String },
      website:      { type: String },
      description:  { type: String },
      approved:     { type: Boolean, default: false },
      joinedAt:     { type: Date },
    },

    // Interaction tracking
    dislikedProducts:  [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    likedProducts:     [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],
    viewedProducts:    [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }],

    // Donation / funding
    donations: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        amount:    { type: Number },
        date:      { type: Date, default: Date.now },
      },
    ],

    isActive:  { type: Boolean, default: true },
    lastLogin: { type: Date },
  },
  { timestamps: true }
);

// Hash password
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

UserSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

UserSchema.methods.toSafeObject = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export default mongoose.models.User || mongoose.model("User", UserSchema);
