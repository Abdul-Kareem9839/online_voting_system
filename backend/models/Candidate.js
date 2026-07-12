const db = require("../config/database");

// Create Candidate
async function createCandidate(constituency_id, candidate_name) {
  const [result] = await db.query(
    `INSERT INTO candidates
    (constituency_id, candidate_name)
    VALUES (?, ?)`,
    [constituency_id, candidate_name],
  );

  return result;
}

// Delete candidate
async function deleteCandidate(candidate_id) {
  const [result] = await db.query(
    `DELETE FROM candidates
     WHERE candidate_id = ?`,
    [candidate_id],
  );

  return result;
}

module.exports = {
  createCandidate,
  deleteCandidate,
};
