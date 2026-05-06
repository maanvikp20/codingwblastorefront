const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    address: {type: String, match: /^\d{1,6}\s[A-Za-z0-9.\s]+,\s?[A-Za-z\s]+,\s?[A-Z]{2}\s\d{5}(-\d{4})?$/, required: true},
    passwordHash: {type: String, required: true},
    phoneNumber: {type: String, match:/^(\()?\d{3}(\))?(-|\s)?\d{3}(-|\s)\d{4}$/, required: true},
    cart: {type: Array, default: []},
    role: {type: String, enum: ["user", "admin", "partner", "student"], default: "user"}
    
  },{timestamps: true}
);

module.exports = mongoose.models.User || mongoose.model("User", userSchema)