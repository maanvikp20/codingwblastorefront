import { loginUser }           from "@/controllers/authController";
import { withErrorHandling }   from "@/middleware/errorHandling";

export const POST = withErrorHandling(async (req) => {
  const { email, password } = await req.json();
  if (!email || !password) {
    return Response.json({ success: false, message: "Email and password required" }, { status: 400 });
  }

  const result = await loginUser({ email, password });
  return Response.json({ success: true, ...result });
});
