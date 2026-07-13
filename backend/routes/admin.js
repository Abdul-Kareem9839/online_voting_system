const express = require("express");
const passport = require("../config/passport");
const router = express.Router({ mergeParams: true });
const db = require("../config/database");
const {
  getAllElections,
  getElectionById,
  getElectionConstituencies,
  getConstituencyCandidates,
} = require("../models/Admin");
const {
  getTotalElections,
  getTotalCandidatesByElection,
  getElectionStatus,
  getElectionTurnout,
  getTotalConstituencies,
  getConstituencyTurnout,
  getTotalCandidatesByConstituency,
  getCandidateVotes,
  getConstituencyResultSnapshot,
  getConstituencyStatus,
  getTotalVotersByAdmin,
  getRegisteredVotersByAdmin,
  getTotalConstituenciesByAdmin,
} = require("../models/functions");

const { loginLimiter } = require("../middlewares/rateLimiter");
const { isAuthenticated, isAdmin } = require("../middlewares/auth");

const { generateToken } = require("../utils/jwt");

router.post("/login", loginLimiter, (req, res, next) => {
  passport.authenticate("admin-local", (err, admin, info) => {
    if (err) {
      return next(err);
    }

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: info.message,
      });
    }

    const token = generateToken({
      id: admin.admin_id,
      role: "admin",
      email: admin.email,
    });

    return res.status(200).json({
      success: true,
      message: "Admin login successful.",
      token,
      user: {
        admin_id: admin.admin_id,
        username: admin.username,
        email: admin.email,
        role: admin.role,
      },
    });
  })(req, res, next);
});

router.get("/dashboard", isAuthenticated, isAdmin, async (req, res) => {
  try {
    const admin_id = req.user.admin_id;

    const [admins] = await db.query(
      `SELECT admin_id, username, email FROM admin WHERE admin_id = ?`,
      [admin_id],
    );

    if (admins.length === 0) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const elections = await getAllElections(admin_id);

    const activeElections = elections.filter(
      (e) => getElectionStatus(e.start_date, e.end_date) === "ongoing",
    ).length;

    const upcomingElections = elections.filter(
      (e) => getElectionStatus(e.start_date, e.end_date) === "upcoming",
    ).length;

    const completedElections = elections.filter(
      (e) => getElectionStatus(e.start_date, e.end_date) === "completed",
    ).length;

    const [totalElections, totalConstituencies, totalVoters, registeredVoters] =
      await Promise.all([
        getTotalElections(admin_id),
        getTotalConstituenciesByAdmin(admin_id),
        getTotalVotersByAdmin(admin_id),
        getRegisteredVotersByAdmin(admin_id),
      ]);

    res.status(200).json({
      message: "Dashboard data fetched successfully",
      admin: admins[0],
      stats: {
        totalElections,
        totalConstituencies,
        totalVoters,
        registeredVoters,
        activeElections,
        upcomingElections,
        completedElections,
      },
    });
  } catch (error) {
    console.error("Dashboard Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
});

//get all elections
router.get("/elections", isAuthenticated, isAdmin, async (req, res) => {
  try {
    const admin_id = req.user.admin_id;

    const elections = await getAllElections(admin_id);

    const electionsWithStats = await Promise.all(
      elections.map(async (election) => {
        const [totalConstituencies, totalCandidates, status, electionTurnout] =
          await Promise.all([
            getTotalConstituencies(election.election_id),
            getTotalCandidatesByElection(election.election_id),
            getElectionStatus(election.start_date, election.end_date),
            getElectionTurnout(election.election_id),
          ]);

        return {
          ...election,
          totalConstituencies,
          totalCandidates,
          status,
          electionTurnout,
        };
      }),
    );

    res.status(200).json({
      success: true,
      elections: electionsWithStats,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

//get single election
router.get(
  "/elections/:election_id",
  isAuthenticated,
  isAdmin,
  async (req, res) => {
    try {
      const { election_id } = req.params;

      const election = await getElectionById(election_id);

      if (!election) {
        return res.status(404).json({
          success: false,
          message: "Election not found",
        });
      }

      res.json({
        success: true,
        election,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        error: err.message,
      });
    }
  },
);

//get all constituencies of an election
router.get(
  "/elections/:election_id/constituencies",
  isAuthenticated,
  isAdmin,
  async (req, res) => {
    try {
      const { election_id } = req.params;
      const election = await getElectionById(election_id);
      const constituencies = await getElectionConstituencies(election_id);

      const constituenciesWithStats = await Promise.all(
        constituencies.map(async (constituency) => {
          const [
            totalCandidates,
            constituencyTurnout,
            constituencyWinnerStats,
          ] = await Promise.all([
            getTotalCandidatesByConstituency(constituency.constituency_id),
            getConstituencyTurnout(constituency.constituency_id),
            getConstituencyResultSnapshot(constituency.constituency_id),
          ]);

          const status = getConstituencyStatus(
            election.start_date,
            election.end_date,
            constituency.status,
          );

          return {
            ...constituency,
            totalCandidates,
            constituencyTurnout,
            constituencyWinnerStats,
            status,
          };
        }),
      );

      res.status(200).json({
        success: true,
        constituencies: constituenciesWithStats,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  },
);

// Get all candidates of a constituency
router.get(
  "/elections/:election_id/constituencies/:constituency_id/candidates",
  isAuthenticated,
  isAdmin,
  async (req, res) => {
    try {
      const { constituency_id } = req.params;

      const candidates = await getConstituencyCandidates(constituency_id);

      const candidatesWithStats = await Promise.all(
        candidates.map(async (candidate) => {
          const totalVotes = await getCandidateVotes(candidate.candidate_id);
          return {
            ...candidate,
            totalVotes,
          };
        }),
      );

      res.status(200).json({
        success: true,
        candidates: candidatesWithStats,
      });
    } catch (err) {
      console.error(err);

      res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  },
);

module.exports = router;
