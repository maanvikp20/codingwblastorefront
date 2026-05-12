import connectDB    from "@/lib/MongoDB";
import User         from "@/models/User";
import { signToken, verifyToken } from "@/lib/jwt";
import { sendEmail } from "@/services/emailService";
import { ApiError }  from "@/middleware/errorHandling";

// Request password reset
export async function requestPasswordReset(email) {
  await connectDB();

  const user = await User.findOne({ email });
  // Don't reveal whether the email exists
  if (!user) return { message: "If that email exists, a reset link has been sent." };

  const token = signToken({ id: user._id, purpose: "password-reset" });
  const link  = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?token=${token}`;

  await sendEmail({
    to:      user.email,
    subject: "Reset your password",
    html:    `<p>Click <a href="${link}">here</a> to reset your password. This link expires in 7 days.</p>`,
  });

  return { message: "If that email exists, a reset link has been sent." };
}

// Confirm password reset 
export async function confirmPasswordReset(token, newPassword) {
  const decoded = verifyToken(token);
  if (!decoded || decoded.purpose !== "password-reset") {
    throw new ApiError("Invalid or expired token", 400);
  }

  await connectDB();
  const user = await User.findById(decoded.id).select("+password");
  if (!user) throw new ApiError("User not found", 404);

  user.password = newPassword;
  await user.save();

  return { message: "Password updated successfully" };
}
