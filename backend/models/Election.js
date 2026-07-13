const db = require("../config/database");

// CREATE ELECTION
async function createElection(data) {
  try {
    const { election_name, start_date, end_date, election_type, admin_id } =
      data;

    const [result] = await db.query(
      `INSERT INTO elections
      (election_name, start_date, end_date, election_type, admin_id)
      VALUES (?, ?, ?, ?, ?)`,
      [election_name, start_date, end_date, election_type, admin_id],
    );

    return result.insertId;
  } catch (err) {
    console.error("Election model error:", err);
    throw err;
  }
}

async function getElectionById(election_id) {
  const [rows] = await db.query(
    "SELECT * FROM elections WHERE election_id = ?",
    [election_id],
  );

  return rows[0];
}

// UPDATE ELECTION
async function updateElection(election_id, data) {
  const allowedFields = [
    "election_name",
    "start_date",
    "end_date",
    "election_type",
  ];
  const fields = [];
  const values = [];

  for (const key in data) {
    if (
      Object.prototype.hasOwnProperty.call(data, key) &&
      allowedFields.includes(key)
    ) {
      fields.push(`${key} = ?`);
      values.push(data[key]);
    }
  }
  if (fields.length === 0) return false;

  values.push(election_id);

  const [result] = await db.query(
    `UPDATE elections
     SET ${fields.join(", ")}
     WHERE election_id = ?`,
    values,
  );

  return result.affectedRows > 0;
}

// DELETE ELECTION
async function deleteElection(election_id) {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();
    await connection.query(
      "DELETE FROM election_results WHERE election_id = ?",
      [election_id],
    );

    await connection.query(
      `DELETE FROM votes WHERE constituency_id IN (
        SELECT constituency_id FROM constituencies WHERE election_id = ?
      )`,
      [election_id],
    );

    await connection.query(
      `DELETE FROM voters WHERE constituency_id IN (
        SELECT constituency_id FROM constituencies WHERE election_id = ?
      )`,
      [election_id],
    );

    await connection.query(
      `DELETE FROM candidates WHERE constituency_id IN (
        SELECT constituency_id FROM constituencies WHERE election_id = ?
      )`,
      [election_id],
    );

    await connection.query("DELETE FROM constituencies WHERE election_id = ?", [
      election_id,
    ]);

    const [result] = await connection.query(
      "DELETE FROM elections WHERE election_id = ?",
      [election_id],
    );

    await connection.commit();
    return result.affectedRows > 0;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

module.exports = {
  createElection,
  getElectionById,
  deleteElection,
  updateElection,
};
