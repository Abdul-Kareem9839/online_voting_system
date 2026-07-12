// Load environment variables immediately
require("dotenv").config();
require("./config/database");
const { initializeDatabase } = require("./config/initDatabase");

const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");
const passport = require("./config/passport");
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);
const { generalLimiter } = require("./middlewares/rateLimiter");

const RegistrationRouter = require("./routes/auth");
const VoterRouter = require("./routes/voters");
const voterAuthRouter = require("./routes/voterAuth");
const CandidateRouter = require("./routes/candidates");
const AdminRouter = require("./routes/admin");
const ElectionRouter = require("./routes/elections");
const ConstituencyRouter = require("./routes/constituency");
const VoteRouter = require("./routes/votes");
const ResultsRouter = require("./routes/result");
const AuthRouter = require("./routes/auth");

app.get("/health", (req, res) => {
  res.status(200).json({ status: "UP", timestamp: new Date() });
});

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

const sessionStore = new MySQLStore({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  clearExpired: true,
  checkExpirationInterval: 900000,
});

if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

app.use(
  session({
    store: sessionStore,
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 1000,
    },
  }),
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/api", generalLimiter);

app.use("/api/admins", AdminRouter);
app.use("/api/voters", VoterRouter);
app.use("/api/voters", voterAuthRouter);
app.use("/api/citizens", RegistrationRouter);
app.use("/api/votes", VoteRouter);
app.use("/api/results", ResultsRouter);
app.use("/api/auth", AuthRouter);
app.use("/api/admins/elections", CandidateRouter);
app.use("/api/admins/elections", ConstituencyRouter);
app.use("/api/admins/elections", ElectionRouter);

app.use("/voters", VoterRouter);
app.use("/voters", voterAuthRouter);

app.use((err, req, res, next) => {
  console.error("🔥 Global Error Caught:", err.stack);
  res.status(err.status || 500).json({
    success: false,
    error:
      process.env.NODE_ENV === "production"
        ? "Internal server error"
        : err.message,
  });
});

const PORT = process.env.PORT || 5000;

initializeDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(
      `Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`,
    );
  });
});
