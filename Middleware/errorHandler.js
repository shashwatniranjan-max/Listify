function errorHandler(err, req, res, next) {
  console.error("Global Error:", err);

  // Zod validation errors
  if (err.name === "ZodError") {
    return res.status(400).json({
      msg: "Validation failed",
      errors: err.issues
    });
  }

  // Mongo duplicate key error
  if (err.code === 11000) {
    return res.status(409).json({
      msg: "Duplicate key error",
      error: err.keyValue
    });
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({ msg: "Invalid token" });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({ msg: "Token expired" });
  }

  // Default fallback
  return res.status(500).json({
    msg: "Internal server error"
  });
}

module.exports = errorHandler;