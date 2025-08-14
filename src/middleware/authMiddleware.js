const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Unauthorized access" });
  }

  try {
    const decodedUser = jwt.verify(token, process.env.JWT_SECRET_KEY);
    console.log("Decoded user:", decodedUser);
    req.user = decodedUser; // Attach user info to request object
    next();
  } catch (error) {
    console.error("Token verification failed", error);
    res.status(403).json({ error: "Invalid or expired token" });
  }
};

module.exports = authMiddleware;
