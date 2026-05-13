import connectDB    from "@/lib/MongoDB";
import User         from "@/models/User";
import { signToken, verifyToken } from "@/lib/jwt";
import { ApiError }  from "@/middleware/errorHandling";

export async function requestPasswordReset(email) {
  await connectDB();

  const user = await User.findOne({ email });
  // Always return same message
  if (!user) return { message: "If that email exists, a reset link has been sent." };

  const token = signToken({ id: user._id.toString(), purpose: "password-reset" });
  const link  = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?token=${token}`;

  // Only attempt email if SMTP is configured
  if (process.env.SMTP_USER && process.env.SMTP_PASS &&
      !process.env.SMTP_USER.includes("your@email")) {
    try {
      const { sendEmail } = await import("@/services/emailService");
      await sendEmail({
        to:      user.email,
        subject: "Reset your password",
        html:    `<p>Click <a href="${link}">here</a> to reset your password. Expires in 7 days.</p>`,
      });
    } catch (err) {
      console.warn("[authService] Email send failed (non-fatal):", err.message);
    }
  } else {
    // Dev mode, log the link so you can test
    console.log("\n[DEV] Password reset link:", link, "\n");
  }

  return { message: "If that email exists, a reset link has been sent." };
}

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