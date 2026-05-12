import { registerUser }        from "@/controllers/authController";
import { withErrorHandling }   from "@/middleware/errorHandling";
import { validateRegister }    from "@/utils/validators";

export const POST = withErrorHandling(async (req) => {
  const body = await req.json();
  const { error } = validateRegister(body);
  if (error) return Response.json({ success: false, message: error }, { status: 400 });

  const result = await registerUser(body);
  return Response.json({ success: true, ...result }, { status: 201 });
});
