const express = require("express");
const router = express.Router();
const { authenticateJWT } = require("../middlewares/authenticateJWT");

router.get("/me", authenticateJWT, (req, res) => {
  return res.status(200).json({
    user: {
      id: req.user.id,
      role: req.user.role,
      email: req.user.email,
    },
  });
});

router.post("/logout", (req, res) => {
  return res.json({ success: true, message: "Logged out successfully" });
});

module.exports = router;
