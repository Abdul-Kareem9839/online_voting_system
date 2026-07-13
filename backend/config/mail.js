const nodemailer = require("nodemailer");

const transporterOptions = {};

if (process.env.EMAIL_HOST) {
  transporterOptions.host = process.env.EMAIL_HOST;
  transporterOptions.port = Number(
    process.env.EMAIL_PORT || (process.env.EMAIL_SECURE === "true" ? 465 : 587),
  );
  transporterOptions.secure = process.env.EMAIL_SECURE === "true";
} else if (process.env.EMAIL_USER?.includes("@gmail.com")) {
  transporterOptions.service = "gmail";
  transporterOptions.secure = true;
} else {
  transporterOptions.host = process.env.EMAIL_HOST || "smtp.gmail.com";
  transporterOptions.port = Number(process.env.EMAIL_PORT || 587);
  transporterOptions.secure = false;
}

transporterOptions.auth = {
  user: process.env.EMAIL_USER,
  pass: process.env.EMAIL_PASS,
};

const transporter = nodemailer.createTransport(transporterOptions);

transporter.verify().catch((err) => {
  console.error("Email transporter verification failed:", err.message);
});

module.exports = transporter;
