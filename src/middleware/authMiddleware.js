const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Unauthorized access" });
  }

  try {
    const decodedUser = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decodedUser; // Attach user info to request object
    next();
  } catch (error) {
    console.error("Token verification failed", error);
    res.status(403).json({ error: "Invalid or expired token" });
  }
};

const adminAuthMiddleware = (req, res, next) => {
  const user = req.user;

  if (!user || user.role !== "admin") {
    return res.status(403).json({ error: "Access denied" });
  }

  next();
};

module.exports = { authMiddleware, adminAuthMiddleware };
