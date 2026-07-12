const db = require("../config/database");
const { getElectionStatus } = require("./functions");

const normalizeEmbeddings = (embeddings) => {
  if (embeddings === null || embeddings === undefined) {
    return null;
  }

  if (typeof embeddings === "string") {
    return embeddings;
  }

  return JSON.stringify(embeddings);
};

const updateVoterRegistration = async (voter_id, embeddings) => {
  const processedEmbeddings = normalizeEmbeddings(embeddings);

  await db.query(
    `UPDATE voters 
     SET face_embedding = ?, 
         face_registered = TRUE, 
         is_registered = TRUE,
         registered_at = CURRENT_TIMESTAMP
     WHERE voter_id = ?`,
    [processedEmbeddings, voter_id],
  );
};

async function getVoterByEmail(email) {
  const [rows] = await db.query(
    `SELECT *
     FROM voters
     WHERE email = ?`,
    [email],
  );

  return rows[0];
}

const getVoterByEmailAndVoterId = async (email, voter_id_number) => {
  const [rows] = await db.query(
    `SELECT * FROM voters 
     WHERE email = ? AND voter_id_number = ?`,
    [email, voter_id_number],
  );
  return rows[0] || null;
};

const getVoterByEmailVoterIdElection = async (
  email,
  voter_id_number,
  election_id,
) => {
  const [rows] = await db.query(
    `
    SELECT *
    FROM voters
    WHERE
      email = ?
      AND voter_id_number = ?
      AND election_id = ?
    `,
    [email, voter_id_number, election_id],
  );

  return rows[0];
};

async function getAllVoters() {
  const [rows] = await db.query(`SELECT * FROM voters`);

  return rows;
}

const getVoterById = async (voter_id) => {
  const [rows] = await db.query(
    `
      SELECT *
      FROM voters
      WHERE voter_id = ?
    `,
    [voter_id],
  );

  return rows[0];
};

async function getVoterDashboardStats(email) {
  const [totalRows] = await db.query(
    `
    SELECT COUNT(*) AS total
    FROM voters
    WHERE email = ?
    `,
    [email],
  );

  const [electionRows] = await db.query(
    `
    SELECT DISTINCT e.start_date, e.end_date
    FROM voters v
    JOIN elections e ON v.election_id = e.election_id
    WHERE v.email = ?
    `,
    [email],
  );

  const activeElections = electionRows.reduce((count, election) => {
    const status = getElectionStatus(election.start_date, election.end_date);
    return count + (status === "ongoing" ? 1 : 0);
  }, 0);

  const [voteRows] = await db.query(
    `
    SELECT COUNT(*) AS votesCast
    FROM votes vt
    JOIN voters v ON vt.voter_id = v.voter_id
    WHERE v.email = ?
    `,
    [email],
  );

  return {
    totalElections: totalRows[0].total,
    activeElections,
    votesCast: voteRows[0].votesCast,
  };
}

async function getElectionTabData() {
  const [elections] = await db.query("SELECT * FROM elections");

  const result = await Promise.all(
    elections.map(async (election) => {
      const [constituencies] = await db.query(
        "SELECT * FROM constituencies WHERE election_id = ?",
        [election.election_id],
      );

      const constituenciesWithCandidates = await Promise.all(
        constituencies.map(async (c) => {
          const [candidates] = await db.query(
            "SELECT * FROM candidates WHERE constituency_id = ?",
            [c.constituency_id],
          );

          return {
            ...c,
            candidates,
          };
        }),
      );

      const electionStatus = getElectionStatus(
        election.start_date,
        election.end_date,
      );

      return {
        ...election,
        status: String(electionStatus),
        constituencies: constituenciesWithCandidates,
      };
    }),
  );

  return result;
}

const getUpcomingElections = async () => {
  const [rows] = await db.query(
    `
    SELECT
      election_id,
      election_name,
      start_date,
      end_date
    FROM elections
    WHERE end_date >= CURDATE()
    ORDER BY start_date ASC
    `,
  );

  return rows;
};

const getConstituenciesByElectionId = async (election_id) => {
  const [rows] = await db.query(
    `
    SELECT
      constituency_id,
      constituency_name
    FROM constituencies
    WHERE election_id = ?
    ORDER BY constituency_name
    `,
    [election_id],
  );

  return rows;
};

const getByEmail = async (email) => {
  const [rows] = await db.query(
    `
    SELECT
      voter_id,
      voter_name,
      email,
      voter_id_number,
      face_registered,
      registered_at
    FROM voters
    WHERE email = ?
    LIMIT 1
    `,
    [email],
  );

  return rows[0] || null;
};

const getDashboardElections = async (email) => {
  const [rows] = await db.query(
    `
    SELECT DISTINCT
      e.election_id,
      e.election_name,
      e.election_type,
      e.start_date,
      e.end_date,
      c.constituency_id,
      c.constituency_name,
      c.status AS constituency_status,
      v.voter_id,
      v.voter_name,
      v.email,
      v.voter_id_number,
      v.face_registered,
      v.is_registered,
      v.registered_at,
      v.has_voted
    FROM voters v
    JOIN elections e
      ON v.election_id = e.election_id
    JOIN constituencies c
      ON v.constituency_id = c.constituency_id
    WHERE v.email = ?
    ORDER BY e.start_date DESC, e.election_name ASC
    `,
    [email],
  );

  return rows;
};

module.exports = {
  updateVoterRegistration,
  getVoterByEmail,
  getVoterByEmailAndVoterId,
  getAllVoters,
  getVoterById,
  getVoterByEmailVoterIdElection,
  getVoterDashboardStats,
  getElectionStatus,
  getElectionTabData,
  getUpcomingElections,
  getByEmail,
  getDashboardElections,
};
