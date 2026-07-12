const express = require("express");
const router = express.Router();

router.get("/me", (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ user: null });
  }

  return res.status(200).json({
    user: {
      id: req.user.voter_id || req.user.admin_id,
      role: req.user.role,
      email: req.user.email,
    },
  });
});

router.post("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: "Logout failed" });
    }
    req.session.destroy();
    res.json({ success: true, message: "Logged out successfully" });
  });
});

module.exports = router;
