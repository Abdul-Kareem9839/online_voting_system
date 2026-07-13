const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const db = require("../config/database");
const otpStore = require("../utils/otpStore");
const { getVoterByEmail, getVoterById } = require("../models/Voter");

passport.use(
  "admin-local",
  new LocalStrategy(
    {
      usernameField: "admin_id",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, admin_id, password, done) => {
      try {
        const { email } = req.body;

        const [rows] = await db.query(
          `
          SELECT admin_id, username, email, password
          FROM admin
          WHERE admin_id = ?
          `,
          [admin_id],
        );

        if (rows.length === 0) {
          return done(null, false, {
            message: "Invalid Admin ID",
          });
        }

        const admin = rows[0];

        if (admin.email !== email) {
          return done(null, false, {
            message: "Invalid Email",
          });
        }

        const passwordMatch =
          typeof admin.password === "string" && admin.password.startsWith("$2")
            ? await bcrypt.compare(password, admin.password)
            : password === admin.password;

        if (!passwordMatch) {
          return done(null, false, {
            message: "Invalid password",
          });
        }

        admin.role = "admin";

        return done(null, admin);
      } catch (err) {
        console.error("Auth error:", err);
        return done(err);
      }
    },
  ),
);

passport.use(
  "voter-local",
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "otp",
    },
    async (email, otp, done) => {
      const voter = await getVoterByEmail(email);

      if (!voter) {
        return done(null, false, {
          message: "Voter not found",
        });
      }

      const record = otpStore.get(email);

      if (!record) {
        return done(null, false, {
          message: "OTP not found",
        });
      }

      if (record.otp !== otp) {
        return done(null, false, {
          message: "Invalid OTP",
        });
      }

      otpStore.delete(email);

      return done(null, voter);
    },
  ),
);

module.exports = passport;
