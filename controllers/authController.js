import connectDB   from "@/lib/MongoDB";
import User        from "@/models/User";
import { signToken } from "@/lib/jwt";
import { ApiError }  from "@/middleware/errorHandling";

// Register 
export async function registerUser({ username, email, password }) {
  await connectDB();

  const exists = await User.findOne({ $or: [{ email }, { username }] });
  if (exists) throw new ApiError("Username or email already taken", 409);

  const user  = await User.create({ username, email, password });
  const token = signToken({ id: user._id, email: user.email, role: user.role });

  return { user: user.toSafeObject(), token };
}

// Login 
export async function loginUser({ email, password }) {
  await connectDB();

  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError("Invalid credentials", 401);
  }
  if (!user.isActive) throw new ApiError("Account is deactivated", 403);

  user.lastLogin = new Date();
  await user.save();

  const token = signToken({ id: user._id, email: user.email, role: user.role });
  return { user: user.toSafeObject(), token };
}

// Get current user profile
export async function getMe(userId) {
  await connectDB();
  const user = await User.findById(userId).select("-password");
  if (!user) throw new ApiError("User not found", 404);
  return user;
}
