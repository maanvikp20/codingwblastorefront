import jwt from "jsonwebtoken";

// sign a new token (7 days for login, can be changed)
export function signToken(payload, expiresIn = "7d") {
  if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is missing in .env");
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
}

// verify if a token is valid
export function verifyToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return null; // returns null if expired or fake
  }
}