import connectDB from "@/lib/MongoDB";
import User from "@/models/User";
import { signToken } from "@/lib/jwt";
import { ApiError } from "@/middleware/errorHandling";

export async function registerUser({ username, email, password }) {
  await connectDB();

  email = email.toLowerCase().trim();
  username = username.trim();

  const exists = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (exists) {
    throw new ApiError("Username or email already taken", 409);
  }

  const user = await User.create({
    username,
    email,
    password,
  });

  const token = signToken({
    id: user._id.toString(),
    email: user.email,
    role: user.role,
  });

  return { user: user.toSafeObject(), token };
}

export async function loginUser({ email, password }) {
  await connectDB();

  email = email.toLowerCase().trim();

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new ApiError("User not found", 401);
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    throw new ApiError("Invalid credentials", 401);
  }

  if (!user.isActive) {
    throw new ApiError("Account is deactivated", 403);
  }

  await User.findByIdAndUpdate(user._id, { lastLogin: new Date() });

  const token = signToken({
    id: user._id.toString(),
    email: user.email,
    role: user.role,
  });

  return {
    user: user.toSafeObject(),
    token,
  };
}

export async function getMe(userId) {
  await connectDB();

  const user = await User.findById(userId).select("-password");

  if (!user) {
    throw new ApiError("User not found", 404);
  }

  return user;
}