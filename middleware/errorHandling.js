function errorHandler(err, req, res, next) {
  if (process.env.NODE_ENV !== "production") {
    console.error("API Error:", err.stack);
  } else {
    console.error("API Error:", err.message);
  }

  // invalid ObjectId (e.g. /users/not-an-id)
  if (err.name === "CastError") {
    return res.status(400).json({ error: "Invalid ID format" });
  }

  // schema validation failed
  if (err.name === "ValidationError") {
    return res.status(400).json({
      error: "Validation failed",
      details: Object.values(err.errors).map(e => e.message)
    });
  }

  // duplicate unique field
  if (err.name === "MongoServerError" && err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(409).json({
      error: `${field} is already in use`
    });
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({ error: "Invalid token" });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({ error: "Token has expired" });
  }

  // Multer / Cloudinary upload errors
  if (err.message && err.message.toLowerCase().includes("file")) {
    return res.status(400).json({ error: err.message });
  }

  // Default: unexpected server error
  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === "production"
      ? "An unexpected error occurred"
      : err.message || "Server error"
  });
}

module.exports = errorHandler;