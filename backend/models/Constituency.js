const db = require("../config/database");

// Create constituency
async function createConstituency(election_id, constituency_name) {
  const [result] = await db.query(
    `
    INSERT INTO constituencies
    (election_id, constituency_name)
    VALUES (?, ?)
    `,
    [election_id, constituency_name],
  );

  return result;
}

// Delete constituency
async function deleteConstituency(constituency_id) {
  const [result] = await db.query(
    "DELETE FROM constituencies WHERE constituency_id = ?",
    [constituency_id],
  );

  return result;
}

module.exports = {
  createConstituency,
  deleteConstituency,
};
