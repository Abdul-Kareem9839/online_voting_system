const db = require("../config/database");
const ElectionModel = require("../models/ElectionResult");
const { sendResultDeclaredEmail } = require("../utils/email");

class ElectionService {
  static async declareResult({ electionId, constituencyId, adminId }) {
    const connection = await db.getConnection();

    try {
      await connection.beginTransaction();

      // 1. Validate Constituency existence
      const constituency = await ElectionModel.getConstituencyDetails(
        connection,
        constituencyId,
        electionId,
      );
      if (!constituency)
        throw { status: 404, message: "Constituency not found" };
      if (constituency.status === "declared")
        throw {
          status: 400,
          message: "Result already declared for this constituency",
        };

      // 2. Validate Date
      const now = new Date();
      const endDate = new Date(constituency.end_date);
      if (isNaN(endDate.getTime()))
        throw { status: 400, message: "Invalid election end date" };
      if (now <= endDate)
        throw {
          status: 400,
          message: "Results can only be declared after the election end date",
        };

      // 3. Gather Voter/Vote Statistics
      const totalEligible = await ElectionModel.getTotalEligibleVoters(
        connection,
        constituencyId,
      );
      const totalCast = await ElectionModel.getTotalVotesCast(
        connection,
        constituencyId,
      );

      // 4. Determine Winner & Margins
      const topCandidates = await ElectionModel.getTopCandidates(
        connection,
        constituencyId,
      );
      if (topCandidates.length === 0)
        throw {
          status: 400,
          message: "No candidates found for this constituency",
        };

      const winner = topCandidates[0];
      const winnerVotes = Number(winner.totalVotes);
      const runnerUpVotes =
        topCandidates.length > 1 ? Number(topCandidates[1].totalVotes) : 0;
      const margin = winnerVotes - runnerUpVotes;

      // 5. Save Results & Complete Database Transaction
      await ElectionModel.insertResult(connection, {
        electionId,
        constituencyId,
        winnerId: winner.candidate_id,
        totalEligible,
        totalCast,
        margin,
        adminId,
      });
      await ElectionModel.updateConstituencyStatus(
        connection,
        constituencyId,
        "declared",
      );

      await connection.commit();

      ElectionService.notifyVoters(connection, constituencyId, {
        electionName: constituency.election_name,
        constituencyName: constituency.constituency_name,
        winnerName: winner.candidate_name,
        totalCast,
        margin,
      });

      return {
        election_id: electionId,
        constituency_id: constituencyId,
        winner_candidate_id: winner.candidate_id,
        winner_name: winner.candidate_name,
        total_eligible_voters: totalEligible,
        total_votes_cast: totalCast,
        winning_margin: margin,
      };
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  static async notifyVoters(connection, constituencyId, details) {
    try {
      const voters = await ElectionModel.getVotersInConstituency(
        connection,
        constituencyId,
      );
      voters.forEach((voter) => {
        sendResultDeclaredEmail({
          email: voter.email,
          voter_name: voter.voter_name,
          election_name: details.electionName || "Election",
          constituency_name: details.constituencyName || "your constituency",
          winner_name: details.winnerName,
          total_votes_cast: details.totalCast,
          winning_margin: details.margin,
        }).catch((err) =>
          console.error(`Email failed for ${voter.email}:`, err),
        );
      });
    } catch (err) {
      console.error("Failed to fetch voters for notification", err);
    }
  }
}

module.exports = ElectionService;
