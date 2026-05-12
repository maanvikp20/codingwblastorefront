import { requestPasswordReset, confirmPasswordReset } from "@/services/authService";
import { withErrorHandling } from "@/middleware/errorHandling";

// POST /api/auth/reset-password
// body: { email } OR { token, newPassword }
export const POST = withErrorHandling(async (req) => {
  const body = await req.json();

  if (body.email) {
    const result = await requestPasswordReset(body.email);
    return Response.json({ success: true, ...result });
  }

  if (body.token && body.newPassword) {
    const result = await confirmPasswordReset(body.token, body.newPassword);
    return Response.json({ success: true, ...result });
  }

  return Response.json(
    { success: false, message: "Provide email (request) or token+newPassword (confirm)" },
    { status: 400 }
  );
});
