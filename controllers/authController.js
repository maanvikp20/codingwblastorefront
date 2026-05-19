import connectDB from "../lib/Mongodb.js";
import User from "@/models/User";
import { signToken, verifyToken } from "@/lib/jwt";

// register a new user
export async function register(req) {
  await connectDB();
  const { name, email, password, phoneNumber } = await req.json();

  if (!name || !email || !password)
    throw Object.assign(new Error("Name, email, and password are required"), {
      status: 400,
    });

  const exists = await User.findOne({ email });
  if (exists)
    throw Object.assign(new Error("Email already in use"), { status: 400 });

  const user = await User.create({ name, email, password, phoneNumber });
  const token = signToken({ id: user._id, email: user.email, role: user.role });

  return Response.json(
    { success: true, token, user: user.toSafeObject() },
    { status: 201 },
  );
}

// login user and issue tokens
export async function login(req) {
  await connectDB();
  const { email, password } = await req.json();

  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.comparePassword(password)))
    throw Object.assign(new Error("Invalid credentials"), { status: 401 });

  if (!user.isActive)
    throw Object.assign(new Error("Account is deactivated"), { status: 403 });

  user.lastLogin = new Date();
  await user.save();

  const token = signToken({ id: user._id, email: user.email, role: user.role });
  const refreshToken = signToken(
    { id: user._id, email: user.email, role: user.role },
    "30d",
  );

  return Response.json({
    success: true,
    token,
    refreshToken,
    user: user.toSafeObject(),
  });
}

// get new access token using refresh token
export async function refresh(req) {
  const { refreshToken } = await req.json();
  if (!refreshToken)
    throw Object.assign(new Error("No refresh token"), { status: 400 });

  const decoded = verifyToken(refreshToken);
  if (!decoded)
    throw Object.assign(new Error("Invalid refresh token"), { status: 401 });

  await connectDB();
  const user = await User.findById(decoded.id);
  if (!user || !user.isActive)
    throw Object.assign(new Error("User not found"), { status: 401 });

  const token = signToken({ id: user._id, email: user.email, role: user.role });
  return Response.json({ success: true, token });
}

// get current logged in user profile
export async function getMe(req, ctx, user) {
  await connectDB();
  const found = await User.findById(user.id).select("-password");
  return Response.json({ success: true, user: found });
}
