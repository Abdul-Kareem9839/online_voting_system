const db = require("../config/database");

const getPendingRegistrations = async (email, voterId) => {
  const [rows] = await db.query(
    `
        SELECT
            v.voter_id,
            v.election_id,
            v.face_registered,
            e.election_name,
            e.start_date,
            e.end_date
        FROM voters v
        JOIN elections e
            ON v.election_id = e.election_id
        WHERE
            v.email = ?
            AND v.voter_id_number = ?
            AND v.is_registered = FALSE
        ORDER BY e.start_date ASC
        `,
    [email, voterId],
  );

  return rows;
};

const voterExists = async (email, voterId) => {
  const [rows] = await db.query(
    `
        SELECT voter_id
        FROM voters
        WHERE email = ?
        AND voter_id_number = ?
        LIMIT 1
        `,
    [email, voterId],
  );

  return rows.length > 0;
};

const getVoterByEmailVoterIdElection = async (email, voterId, electionId) => {
  const [rows] = await db.query(
    `
    SELECT *
    FROM voters
    WHERE
      email = ?
      AND voter_id_number = ?
      AND election_id = ?
    LIMIT 1
    `,
    [email, voterId, electionId],
  );

  return rows[0] || null;
};

const getExistingFaceEmbedding = async (email) => {
  const [rows] = await db.query(
    `
    SELECT face_embedding
    FROM voters
    WHERE
      email = ?
      AND face_registered = TRUE
    LIMIT 1
    `,
    [email],
  );

  return rows.length ? rows[0].face_embedding : null;
};

const normalizeEmbeddings = (embeddings) => {
  if (embeddings === null || embeddings === undefined) {
    return null;
  }

  if (typeof embeddings === "string") {
    return embeddings;
  }

  return JSON.stringify(embeddings);
};

const updateVoterRegistration = async (voterId, embeddings) => {
  const normalizedEmbeddings = normalizeEmbeddings(embeddings);

  await db.query(
    `
   UPDATE voters
SET
  face_embedding = ?,
  face_registered = TRUE,
  is_registered = TRUE,
  registered_at = NOW()
WHERE voter_id = ?
    `,
    [normalizedEmbeddings, voterId],
  );
};

const getVoterById = async (voterId) => {
  const [rows] = await db.query(
    `
    SELECT *
    FROM voters
    WHERE voter_id = ?
    LIMIT 1
    `,
    [voterId],
  );

  return rows[0] || null;
};

const getVoterByEmail = async (email) => {
  const [rows] = await db.query(
    `
    SELECT *
    FROM voters
    WHERE email = ?
    LIMIT 1
    `,
    [email],
  );

  return rows[0] || null;
};

module.exports = {
  getPendingRegistrations,
  voterExists,
  getVoterByEmailVoterIdElection,
  getExistingFaceEmbedding,
  updateVoterRegistration,
  getVoterById,
  getVoterByEmail,
};
