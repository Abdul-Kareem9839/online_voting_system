const express = require("express");
const router = express.Router();
const db = require("../config/database");
const { isAuthenticated, isVoter } = require("../middlewares/auth");
const {
  getElections,
  getConstituencies,
  getDashboard,
} = require("../controllers/voterController");
const {
  getConstituencyStatus,
  getElectionStatus,
} = require("../models/functions");

router.get("/elections", isAuthenticated, isVoter, getElections);

router.get(
  "/elections/:election_id/constituencies",
  isAuthenticated,
  isVoter,
  getConstituencies,
);

router.get("/dashboard", isAuthenticated, isVoter, getDashboard);

router.get(
  "/dashboard/electionTab",
  isAuthenticated,
  isVoter,
  async (req, res) => {
    try {
      const email = req.user.email;

      const [rows] = await db.query(
        `SELECT
        v.voter_id,
        v.election_id,
        v.constituency_id,
        v.has_voted,
        e.election_name,
        e.election_type,
        e.start_date,
        e.end_date,
        c.constituency_id,
        c.constituency_name,
        c.status AS constituency_status,
        can.candidate_id,
        can.candidate_name
       FROM voters v
       JOIN elections e ON v.election_id = e.election_id
       JOIN constituencies c ON v.constituency_id = c.constituency_id
       LEFT JOIN candidates can ON can.constituency_id = c.constituency_id
       WHERE v.email = ?`,
        [email],
      );

      if (rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Voter not found",
        });
      }

      // Group rows by election since JOIN duplicates rows per candidate
      const electionsMap = new Map();

      for (const row of rows) {
        if (!electionsMap.has(row.election_id)) {
          electionsMap.set(row.election_id, {
            voter_id: row.voter_id,
            election_id: row.election_id,
            election_name: row.election_name,
            election_type: row.election_type,
            start_date: row.start_date,
            end_date: row.end_date,
            has_voted: row.has_voted,
            status: getElectionStatus(row.start_date, row.end_date),
            constituency: {
              constituency_id: row.constituency_id,
              constituency_name: row.constituency_name,
              status: getConstituencyStatus(
                row.start_date,
                row.end_date,
                row.constituency_status,
              ),
              candidates: [],
            },
          });
        }

        // Add candidate if exists
        if (row.candidate_id) {
          electionsMap.get(row.election_id).constituency.candidates.push({
            candidate_id: row.candidate_id,
            candidate_name: row.candidate_name,
          });
        }
      }

      const elections = Array.from(electionsMap.values());

      res.json({
        success: true,
        email,
        elections,
      });
    } catch (err) {
      console.error("Election Tab Error:", err);
      res.status(500).json({
        success: false,
        message: "Election tab fetch failed",
      });
    }
  },
);

router.get(
  "/elections/:election_id/my-constituency-results",
  isAuthenticated,
  isVoter,
  async (req, res) => {
    try {
      const { election_id } = req.params;
      const voterEmail = req.user?.email;

      if (!voterEmail) {
        return res.status(401).json({
          success: false,
          message: "Voter session missing",
        });
      }

      const [voterRows] = await db.query(
        `SELECT constituency_id
         FROM voters
         WHERE email = ? AND election_id = ?
         LIMIT 1`,
        [voterEmail, election_id],
      );

      if (!voterRows.length) {
        return res.status(404).json({
          success: false,
          message: "Voter is not registered for this election",
        });
      }

      const constituencyId = voterRows[0].constituency_id;

      const [electionRows] = await db.query(
        `SELECT election_id, election_name, start_date, end_date
         FROM elections
         WHERE election_id = ?`,
        [election_id],
      );

      if (!electionRows.length) {
        return res.status(404).json({
          success: false,
          message: "Election not found",
        });
      }

      const [constituencyRows] = await db.query(
        `SELECT constituency_id, constituency_name, status
         FROM constituencies
         WHERE constituency_id = ? AND election_id = ?`,
        [constituencyId, election_id],
      );

      if (!constituencyRows.length) {
        return res.status(404).json({
          success: false,
          message: "Constituency not found for this voter",
        });
      }

      const [candidateRows] = await db.query(
        `
        SELECT
          c.candidate_id,
          c.candidate_name AS name,
          COUNT(v.vote_id) AS votes
        FROM candidates c
        LEFT JOIN votes v
          ON c.candidate_id = v.candidate_id
         AND v.election_id = ?
         AND v.constituency_id = ?
        WHERE c.constituency_id = ?
        GROUP BY c.candidate_id, c.candidate_name
        ORDER BY votes DESC, c.candidate_name ASC
        `,
        [election_id, constituencyId, constituencyId],
      );

      const candidates = (candidateRows || []).map((candidate) => ({
        ...candidate,
        votes: Number(candidate.votes) || 0,
      }));

      res.status(200).json({
        success: true,
        election_id,
        constituency_id: constituencyId,
        constituency_name: constituencyRows[0].constituency_name,
        candidates,
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
