const db = require("../config/database");

// Create admin
async function createAdmin(data) {
  const { username, email, password } = data;

  const [result] = await db.query(
    `INSERT INTO admin
    ( username, email, password)
     VALUES ( ?, ?, ?)`,
    [username, email, password],
  );

  return result.insertId;
}

// GET ALL ELECTIONS
async function getAllElections(admin_id) {
  const [rows] = await db.query(
    "SELECT * FROM elections WHERE admin_id = ? ORDER BY election_id DESC",
    [admin_id],
  );

  return rows;
}

// GET ELECTION BY ID
async function getElectionById(election_id) {
  const [rows] = await db.query(
    "SELECT * FROM elections WHERE election_id = ?",
    [election_id],
  );

  return rows[0];
}

// Get all constituencies
async function getElectionConstituencies(election_id) {
  const [rows] = await db.query(
    `
    SELECT *
    FROM constituencies
    WHERE election_id = ?
    ORDER BY constituency_name
    `,
    [election_id],
  );

  return rows;
}

//get constituency Candidates
async function getConstituencyCandidates(constituency_id) {
  const [rows] = await db.query(
    `SELECT * FROM candidates
     WHERE constituency_id = ?`,
    [constituency_id],
  );

  return rows;
}

module.exports = {
  createAdmin,
  getAllElections,
  getElectionById,
  getElectionConstituencies,
  getConstituencyCandidates,
};
