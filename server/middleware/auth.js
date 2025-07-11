const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Middleware to verify JWT and attach user to request
const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized – No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret123");

    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(401).json({ message: "User not found" });

    req.user = user;
    next();
  } catch (err) {
    console.error("Auth error:", err);
    res.status(403).json({ message: "Forbidden – Invalid token" });
  }
};

// Middleware to restrict access to admins only
const requireAdmin = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Forbidden – Admins only" });
  }
  next();
};

module.exports = {
  authenticate,
  requireAdmin,
};
