import crypto from "crypto";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

// forgot password, gen reset token, save to user
export async function forgotPassword(req) {
  await connectDB();
  const { email } = await req.json();

  // Find the user by email; include the password reset fields
  const user = await User.findOne({ email }).select(
    "+passwordResetToken +passwordResetExpires",
  );

  // Always return success message to prevent email attacks, even if user doesn't exist
  if (!user)
    return Response.json({
      success: true,
      message: "If that email exists, a reset token was generated",
    });

  // crypto.randomBytes gives random string of hex characters, basically an OTP
  const token = crypto.randomBytes(32).toString("hex");

  // Token expires in 1 hour
  user.passwordResetToken = token;
  user.passwordResetExpires = new Date(Date.now() + 3600000);
  await user.save();

  // TODO: replace with email delivery before going to production — never expose resetToken in the response body
  return Response.json({ success: true, resetToken: token });
}

// reset password using the token
export async function resetPassword(req) {
  await connectDB();
  const { token, newPassword } = await req.json();

  // Find user matching token and check if token not expired
  const user = await User.findOne({
    passwordResetToken: token,
    passwordResetExpires: { $gt: new Date() }, // $gt means "greater than" checks the token hasn't expired
  }).select("+password +passwordResetToken +passwordResetExpires");

  // 400 error if token invalid or expired
  if (!user)
    throw Object.assign(new Error("Invalid or expired reset token"), {
      status: 400,
    });

  //Sets new passwords and clears reset token fields
  user.password = newPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  return Response.json({
    success: true,
    message: "Password reset successfully",
  });
}
