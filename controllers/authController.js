const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("@/models/User");

function signToken(user) {
  return jwt.sign(
    {
      email: user.email,
      name: user.name,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      subject: String(user._id),
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    }
  );
}

async function register(body) {
  const { name, email, password } = body;

  if (!name || !email || !password) {
    return Response.json(
      { error: "name, email, and password are required" },
      { status: 400 }
    );
  }

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    return Response.json(
      { error: "Email already in use" },
      { status: 409 }
    );
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const created = await User.create({
    name,
    email: email.toLowerCase(),
    passwordHash,
  });

  const token = signToken(created);

  return Response.json(
    {
      data: {
        token,
        user: {
          id: created._id,
          name: created.name,
          email: created.email,
        },
      },
    },
    { status: 201 }
  );
}

async function login(body) {
  const { email, password } = body;

  if (!email || !password) {
    return Response.json(
      { error: "email and password are required" },
      { status: 400 }
    );
  }

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    return Response.json(
      { error: "Invalid Credentials" },
      { status: 401 }
    );
  }

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    return Response.json(
      { error: "Invalid Credentials" },
      { status: 401 }
    );
  }

  const token = signToken(user);

  return Response.json({
    data: {
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        cart: user.cart,
      },
    },
  });
}

module.exports = { login };
module.exports = { register };