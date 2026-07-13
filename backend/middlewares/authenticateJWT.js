const { verifyToken } = require("../utils/jwt");

const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  const decoded = verifyToken(token);

  if (!decoded) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }

  req.user = {
    ...decoded,
    admin_id: decoded.role === "admin" ? decoded.id : undefined,
    voter_id: decoded.role === "voter" ? decoded.id : undefined,
  };

  return next();
};

const authorizeRole = (role) => (req, res, next) => {
  if (!req.user || req.user.role !== role) {
    return res.status(403).json({ message: `${role} access required` });
  }

  next();
};

module.exports = { authenticateJWT, authorizeRole };
