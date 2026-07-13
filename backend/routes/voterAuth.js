const express = require("express");
const passport = require("../config/passport");
const router = express.Router();

const {
  checkEligibility,
  sendOtp,
  verifyOtp,
  register,
  verifyFace,
  loginSendOtp,
  loginVerifyOtp,
} = require("../controllers/voterAuthController");

const {
  validateEligibility,
  validateSendOtp,
  validateVerifyOtp,
  validateRegister,
  validateVerifyFace,
  validateLoginSendOtp,
  validateLoginVerifyOtp,
} = require("../middlewares/validation");

const {
  faceVerifyLimiter,
  registerLimiter,
  sendOtpLimiter,
  verifyOtpLimiter,
  emailOtpLimiter,
  eligibilityLimiter,
} = require("../middlewares/rateLimiter");

router.post(
  "/check-eligibility",
  eligibilityLimiter,
  validateEligibility,
  checkEligibility,
);

router.post(
  "/send-otp",
  emailOtpLimiter,
  sendOtpLimiter,
  validateSendOtp,
  sendOtp,
);

router.post("/verify-otp", verifyOtpLimiter, validateVerifyOtp, verifyOtp);

router.post("/register", registerLimiter, validateRegister, register);

router.post("/verify-face", faceVerifyLimiter, validateVerifyFace, verifyFace);

router.post(
  "/login/send-otp",
  emailOtpLimiter,
  sendOtpLimiter,
  validateLoginSendOtp,
  loginSendOtp,
);

router.post(
  "/login/verify-otp",
  verifyOtpLimiter,
  validateLoginVerifyOtp,
  loginVerifyOtp(passport),
);

module.exports = router;
