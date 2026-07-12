function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function saveOtp(email, otp, otpStore) {
  otpStore.set(email, {
    otp,
    expiresAt: Date.now() + 5 * 60 * 1000,
  });
}

module.exports = {
  generateOtp,
  saveOtp,
};
