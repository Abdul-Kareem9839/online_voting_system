const express = require("express");
const router = express.Router();
const ElectionController = require("../controllers/electionResult");
const { isAuthenticated, isAdmin } = require("../middlewares/auth");
const { declareResultLimiter } = require("../middlewares/rateLimiter");

router.post(
  "/declare-result",
  declareResultLimiter,
  isAuthenticated,
  isAdmin,
  ElectionController.declareResult,
);

module.exports = router;

// const express = require("express");
// const router = express.Router();
// const db = require("../config/database");
// const { isAuthenticated, isAdmin } = require("../middlewares/auth");
// const { sendResultDeclaredEmail } = require("../utils/email");
// const { declareResultLimiter } = require("../middlewares/rateLimiter");

// router.post(
//   "/declare-result",
//   declareResultLimiter,
//   isAuthenticated,
//   isAdmin,
//   async (req, res) => {
//     const admin_id = req.user.admin_id;
//     const { election_id, constituency_id } = req.body;

//     if (!election_id || !constituency_id || !admin_id) {
//       return res.status(400).json({
//         error:
//           "Missing required fields: election_id, constituency_id, admin_id",
//       });
//     }

//     const connection = await db.getConnection();

//     try {
//       await connection.beginTransaction();
//       const [constituencyRows] = await connection.query(
//         `
//       SELECT c.status, c.constituency_name, e.election_name, e.end_date
//       FROM constituencies c
//       JOIN elections e ON c.election_id = e.election_id
//       WHERE c.constituency_id = ?
//       AND c.election_id = ?
//       `,
//         [constituency_id, election_id],
//       );

//       if (constituencyRows.length === 0) {
//         await connection.rollback();
//         return res.status(404).json({
//           error: "Constituency not found",
//         });
//       }

//       const {
//         status: constituencyStatus,
//         constituency_name,
//         election_name,
//         end_date: electionEndDate,
//       } = constituencyRows[0];

//       if (constituencyStatus === "declared") {
//         await connection.rollback();
//         return res.status(400).json({
//           error: "Result already declared for this constituency",
//         });
//       }

//       const now = new Date();
//       const endDate = new Date(electionEndDate);

//       if (isNaN(endDate.getTime())) {
//         await connection.rollback();
//         return res.status(400).json({
//           error: "Invalid election end date",
//         });
//       }

//       if (now <= endDate) {
//         await connection.rollback();
//         return res.status(400).json({
//           error: "Results can only be declared after the election end date",
//         });
//       }

//       const [eligibleRows] = await connection.query(
//         `
//       SELECT COUNT(*) AS totalEligible
//       FROM voters
//       WHERE constituency_id = ?
//       `,
//         [constituency_id],
//       );

//       const totalEligibleVoters = Number(eligibleRows[0]?.totalEligible) || 0;

//       const [votesCastRows] = await connection.query(
//         `
//       SELECT COUNT(*) AS totalVotesCast
//       FROM votes
//       WHERE constituency_id = ?
//       `,
//         [constituency_id],
//       );

//       const totalVotesCast = Number(votesCastRows[0]?.totalVotesCast) || 0;

//       const [candidateRows] = await connection.query(
//         `
//       SELECT
//         c.candidate_id,
//         c.candidate_name,
//         COUNT(v.vote_id) AS totalVotes
//       FROM candidates c
//       LEFT JOIN votes v
//         ON c.candidate_id = v.candidate_id
//         AND v.constituency_id = ?
//       WHERE c.constituency_id = ?
//       GROUP BY c.candidate_id, c.candidate_name
//       ORDER BY totalVotes DESC
//       LIMIT 2
//       `,
//         [constituency_id, constituency_id],
//       );

//       if (candidateRows.length === 0) {
//         await connection.rollback();
//         return res.status(400).json({
//           error: "No candidates found for this constituency",
//         });
//       }

//       const winner = candidateRows[0];
//       const winnerVotes = Number(winner.totalVotes);

//       let winningMargin = winnerVotes;

//       if (candidateRows.length > 1) {
//         winningMargin = winnerVotes - Number(candidateRows[1].totalVotes);
//       }

//       await connection.query(
//         `
//       INSERT INTO election_results (
//         election_id,
//         constituency_id,
//         winner_candidate_id,
//         total_eligible_voters,
//         total_votes_cast,
//         winning_margin,
//         declared_by_admin_id
//       )
//       VALUES (?, ?, ?, ?, ?, ?, ?)
//       `,
//         [
//           election_id,
//           constituency_id,
//           winner.candidate_id,
//           totalEligibleVoters,
//           totalVotesCast,
//           winningMargin,
//           admin_id,
//         ],
//       );

//       await connection.query(
//         `
//       UPDATE constituencies
//       SET status = 'declared'
//       WHERE constituency_id = ?
//       `,
//         [constituency_id],
//       );

//       await connection.commit();

//       const [voterRows] = await connection.query(
//         `
//       SELECT voter_name, email
//       FROM voters
//       WHERE constituency_id = ?
//       `,
//         [constituency_id],
//       );

//       const emailPromises = voterRows.map((voter) =>
//         sendResultDeclaredEmail({
//           email: voter.email,
//           voter_name: voter.voter_name,
//           election_name: election_name || "Election",
//           constituency_name: constituency_name || "your constituency",
//           winner_name: winner.candidate_name,
//           total_votes_cast: totalVotesCast,
//           winning_margin: winningMargin,
//         }).catch((err) => {
//           console.error(
//             `Result notification email failed for ${voter.email}:`,
//             err,
//           );
//         }),
//       );

//       await Promise.all(emailPromises);

//       return res.status(200).json({
//         success: true,
//         message: "Result declared successfully",
//         result: {
//           election_id,
//           constituency_id,
//           winner_candidate_id: winner.candidate_id,
//           winner_name: winner.candidate_name,
//           total_eligible_voters: totalEligibleVoters,
//           total_votes_cast: totalVotesCast,
//           winning_margin: winningMargin,
//         },
//       });
//     } catch (err) {
//       await connection.rollback();

//       console.error("Declare Result Error:", err);

//       return res.status(500).json({
//         error: "Internal server error",
//       });
//     } finally {
//       connection.release();
//     }
//   },
// );

// module.exports = router;
