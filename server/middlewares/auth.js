import jwt from "jsonwebtoken";
import { User } from "../models/user.js";

const protect = async (req, res, next) => {
  try {
    let token =
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
        ? req.headers.authorization.split(" ")[1]
        : null;

    // ❌ no token case handle
    if (!token) {
      return res.status(401).json({ msg: "No token, not authorized" });
    }

    // ✅ verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ get user
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(401).json({ msg: "User not found" });
    }

    next();
  } catch (error) {
    res.status(401).json({ msg: "Token failed or invalid" });
  }
};

const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    return res.status(403).json({ msg: "Not authorized as admin" });
  }
};

export { protect, admin };