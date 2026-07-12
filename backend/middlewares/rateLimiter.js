const rateLimit = require("express-rate-limit");

const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: {
    success: false,
    message: "Too many requests. Please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const eligibilityLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 20,
  message: {
    success: false,
    message: "Too many eligibility checks. Please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    success: false,
    message: "Too many login attempts. Try again after 15 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: {
    success: false,
    message: "Too many registration attempts. Try later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const faceVerifyLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 10,
  message: {
    success: false,
    message: "Too many face verification attempts.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const voteLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: {
    success: false,
    message: "Too many voting attempts.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const sendOtpLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 3,
  message: {
    success: false,
    message: "Too many OTP requests. Please try again after 10 minutes.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const verifyOtpLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  keyGenerator: (req) => {
    return req.body.email?.toLowerCase();
  },
  message: {
    success: false,
    message: "Too many incorrect OTP attempts. Try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const emailOtpLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  keyGenerator: (req) => {
    return req.body.email?.toLowerCase();
  },
  message: {
    success: false,
    message: "Too many OTP requests for this email.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const declareResultLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  message: {
    success: false,
    message: "Too many result declaration attempts. Please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  generalLimiter,
  loginLimiter,
  registerLimiter,
  faceVerifyLimiter,
  voteLimiter,
  sendOtpLimiter,
  verifyOtpLimiter,
  emailOtpLimiter,
  declareResultLimiter,
  eligibilityLimiter,
};
