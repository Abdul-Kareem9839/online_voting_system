const isAuthenticated = (req, res, next) => {
  console.log("SESSION:", req.session);
  console.log("USER:", req.user);
  console.log("AUTH:", req.isAuthenticated());
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Please log in to access this resource" });
};

const isAdmin = (req, res, next) => {
  console.log("ISADMIN USER:", req.user);
  if (req.isAuthenticated() && req.user.role === "admin") {
    return next();
  }
  res.status(403).json({ message: "Admin access required" });
};

const isVoter = (req, res, next) => {
  console.log("isAuthenticated:", req.isAuthenticated());
  console.log("req.user:", req.user);
  if (req.isAuthenticated() && req.user.role === "voter") {
    return next();
  }
  res.status(403).json({ message: "Voter access required" });
};

module.exports = { isAuthenticated, isAdmin, isVoter };
