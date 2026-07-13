const { authenticateJWT } = require("./authenticateJWT");

const isAuthenticated = authenticateJWT;

const isAdmin = (req, res, next) => {
  if (req.user?.role === "admin") {
    return next();
  }
  return res.status(403).json({ message: "Admin access required" });
};

const isVoter = (req, res, next) => {
  if (req.user?.role === "voter") {
    return next();
  }
  return res.status(403).json({ message: "Voter access required" });
};

module.exports = { isAuthenticated, isAdmin, isVoter };
