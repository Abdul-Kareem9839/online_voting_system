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

        // Use bcrypt to compare passwords
        const passwordMatch = await bcrypt.compare(password, admin.password);
        if (!passwordMatch) {
          return done(null, false, {
            message: "Invalid password",
          });
        }

        admin.role = "admin";

        return done(null, admin);
      } catch (err) {
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

passport.serializeUser((user, done) => {
  console.log("SERIALIZE SESSION:", {
    id: user.admin_id || user.voter_id,
    role: user.role,
  });

  done(null, {
    id: user.admin_id || user.voter_id,
    role: user.admin_id ? "admin" : "voter",
  });
});

passport.deserializeUser(async (sessionUser, done) => {
  console.log("DESERIALIZE:", sessionUser);
  try {
    if (sessionUser.role === "admin") {
      const [rows] = await db.query("SELECT * FROM admin WHERE admin_id=?", [
        sessionUser.id,
      ]);

      return done(null, { ...rows[0], role: sessionUser.role });
    }

    if (sessionUser.role === "voter") {
      const voter = await getVoterById(sessionUser.id);

      return done(null, {
        ...voter,
        role: sessionUser.role,
      });
    }

    done(null, false);
  } catch (err) {
    done(err);
  }
});

module.exports = passport;
