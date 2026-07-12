const db = require("../config/database");

class ElectionModel {
  static async getConstituencyDetails(connection, constituencyId, electionId) {
    const [rows] = await connection.query(
      `SELECT c.status, c.constituency_name, e.election_name, e.end_date
       FROM constituencies c
       JOIN elections e ON c.election_id = e.election_id
       WHERE c.constituency_id = ? AND c.election_id = ?`,
      [constituencyId, electionId],
    );
    return rows[0] || null;
  }

  static async getTotalEligibleVoters(connection, constituencyId) {
    const [rows] = await connection.query(
      `SELECT COUNT(*) AS totalEligible FROM voters WHERE constituency_id = ?`,
      [constituencyId],
    );
    return Number(rows[0]?.totalEligible) || 0;
  }

  static async getTotalVotesCast(connection, constituencyId) {
    const [rows] = await connection.query(
      `SELECT COUNT(*) AS totalVotesCast FROM votes WHERE constituency_id = ?`,
      [constituencyId],
    );
    return Number(rows[0]?.totalVotesCast) || 0;
  }

  static async getTopCandidates(connection, constituencyId) {
    const [rows] = await connection.query(
      `SELECT c.candidate_id, c.candidate_name, COUNT(v.vote_id) AS totalVotes
       FROM candidates c
       LEFT JOIN votes v ON c.candidate_id = v.candidate_id AND v.constituency_id = ?
       WHERE c.constituency_id = ?
       GROUP BY c.candidate_id, c.candidate_name
       ORDER BY totalVotes DESC LIMIT 2`,
      [constituencyId, constituencyId],
    );
    return rows;
  }

  static async insertResult(connection, data) {
    await connection.query(
      `INSERT INTO election_results (election_id, constituency_id, winner_candidate_id, total_eligible_voters, total_votes_cast, winning_margin, declared_by_admin_id)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        data.electionId,
        data.constituencyId,
        data.winnerId,
        data.totalEligible,
        data.totalCast,
        data.margin,
        data.adminId,
      ],
    );
  }

  static async updateConstituencyStatus(connection, constituencyId, status) {
    await connection.query(
      `UPDATE constituencies SET status = ? WHERE constituency_id = ?`,
      [status, constituencyId],
    );
  }

  static async getVotersInConstituency(connection, constituencyId) {
    const [rows] = await connection.query(
      `SELECT voter_name, email FROM voters WHERE constituency_id = ?`,
      [constituencyId],
    );
    return rows;
  }
}

module.exports = ElectionModel;
