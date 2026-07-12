// models/Vote.js

const db = require("../config/database");

async function castVote(data) {
  try {
    const { voter_id, election_id, candidate_id, constituency_id } = data;

    const [result] = await db.query(
      `INSERT INTO votes
       (voter_id, election_id, candidate_id, constituency_id)
       VALUES (?, ?, ?, ?)`,
      [voter_id, election_id, candidate_id, constituency_id],
    );

    await db.query(
      `UPDATE voters
       SET has_voted = 1
       WHERE voter_id = ?
       AND election_id = ?`,
      [voter_id, election_id],
    );

    return result.insertId;
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      throw new Error("You have already voted in this election");
    }
    throw err;
  }
}

module.exports = { castVote };
