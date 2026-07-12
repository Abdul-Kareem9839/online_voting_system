const db = require("../config/database");

const getTotalElections = async (admin_id) => {
  const [rows] = await db.query(
    `
    SELECT COUNT(*) AS totalElections
    FROM elections
    WHERE admin_id = ?
    `,
    [admin_id],
  );

  return rows[0].totalElections;
};

const getTotalConstituencies = async (election_id) => {
  const [rows] = await db.query(
    `
    SELECT COUNT(*) AS totalConstituencies
    FROM constituencies
    WHERE election_id = ?
    `,
    [election_id],
  );

  return rows[0].totalConstituencies;
};

const getTotalCandidatesByConstituency = async (constituency_id) => {
  const [rows] = await db.query(
    `
    SELECT COUNT(*) AS totalCandidates
    FROM candidates
    WHERE constituency_id = ?
    `,
    [constituency_id],
  );

  return rows[0].totalCandidates;
};

const getTotalCandidatesByElection = async (election_id) => {
  const [rows] = await db.query(
    `
    SELECT COUNT(*) AS totalCandidates
    FROM candidates c
    JOIN constituencies con
      ON c.constituency_id = con.constituency_id
    WHERE con.election_id = ?
    `,
    [election_id],
  );

  return rows[0].totalCandidates;
};

const getTotalVotesByElection = async (election_id) => {
  const [rows] = await db.query(
    `
    SELECT COUNT(*) AS totalVotes
    FROM votes
    WHERE election_id = ?
    `,
    [election_id],
  );

  return rows[0].totalVotes;
};

const getTotalVotesByConstituency = async (constituency_id) => {
  const [rows] = await db.query(
    `
    SELECT COUNT(*) AS totalVotes
    FROM votes
    WHERE constituency_id = ?
    `,
    [constituency_id],
  );

  return rows[0].totalVotes;
};

const getCandidateVotes = async (candidate_id) => {
  const [rows] = await db.query(
    `
    SELECT COUNT(*) AS totalVotes
    FROM votes
    WHERE candidate_id = ?
    `,
    [candidate_id],
  );

  return rows[0].totalVotes;
};

const getElectionTurnout = async (election_id) => {
  const [rows] = await db.query(
    `
    SELECT
      COUNT(DISTINCT v.vote_id) AS votesCast,
      (
        SELECT COUNT(*)
        FROM voters
        WHERE election_id = ?
      ) AS totalVoters
    FROM votes v
    WHERE v.election_id = ?
    `,
    [election_id, election_id],
  );

  const { votesCast, totalVoters } = rows[0];

  return {
    votesCast,
    totalVoters,
    turnout: totalVoters > 0 ? ((votesCast / totalVoters) * 100).toFixed(2) : 0,
  };
};

const getConstituencyTurnout = async (constituency_id) => {
  const [rows] = await db.query(
    `
    SELECT
      COUNT(*) AS votesCast,
      (
        SELECT COUNT(*)
        FROM voters
        WHERE constituency_id = ?
      ) AS totalVoters
    FROM votes
    WHERE constituency_id = ?
    `,
    [constituency_id, constituency_id],
  );

  const { votesCast, totalVoters } = rows[0];

  return {
    votesCast,
    totalVoters,
    turnout: totalVoters > 0 ? ((votesCast / totalVoters) * 100).toFixed(2) : 0,
  };
};

const getConstituencyResultSnapshot = async (constituency_id) => {
  const [candidateRows] = await db.query(
    `
    SELECT
      c.candidate_id,
      c.candidate_name,
      COUNT(v.vote_id) AS totalVotes
    FROM candidates c
    LEFT JOIN votes v
      ON c.candidate_id = v.candidate_id
      AND v.constituency_id = ?
    WHERE c.constituency_id = ?
    GROUP BY c.candidate_id, c.candidate_name
    ORDER BY totalVotes DESC
    LIMIT 2;
    `,
    [constituency_id, constituency_id],
  );

  if (candidateRows.length === 0) {
    return {
      winner_candidate_id: null,
      winner_name: "No Candidates",
      winning_margin: 0,
    };
  }

  const winner = candidateRows[0];
  const winnerVotes = Number(winner.totalVotes);

  if (candidateRows.length === 1) {
    return {
      winner_candidate_id: winner.candidate_id,
      winner_name: winner.candidate_name,
      winning_margin: winnerVotes,
    };
  }

  const runnerUp = candidateRows[1];
  const margin = winnerVotes - Number(runnerUp.totalVotes);

  return {
    winner_candidate_id: winner.candidate_id,
    winner_name: winner.candidate_name,
    winning_margin: margin,
  };
};

const getTotalVotersByAdmin = async (admin_id) => {
  const [rows] = await db.query(
    `SELECT COUNT(*) AS totalVoters
     FROM voters v
     JOIN elections e ON v.election_id = e.election_id
     WHERE e.admin_id = ?`,
    [admin_id],
  );
  return rows[0].totalVoters;
};

const getRegisteredVotersByAdmin = async (admin_id) => {
  const [rows] = await db.query(
    `SELECT COUNT(*) AS registeredVoters
     FROM voters v
     JOIN elections e ON v.election_id = e.election_id
     WHERE e.admin_id = ? AND v.is_registered = TRUE`,
    [admin_id],
  );
  return rows[0].registeredVoters;
};

const getTotalConstituenciesByAdmin = async (admin_id) => {
  const [rows] = await db.query(
    `SELECT COUNT(*) AS totalConstituencies
     FROM constituencies c
     JOIN elections e ON c.election_id = e.election_id
     WHERE e.admin_id = ?`,
    [admin_id],
  );
  return rows[0].totalConstituencies;
};

function parseLocalDate(dateValue) {
  if (!dateValue) return null;

  if (dateValue instanceof Date) {
    const year = dateValue.getUTCFullYear();
    const month = dateValue.getUTCMonth();
    const day = dateValue.getUTCDate();
    const hour = dateValue.getUTCHours();
    const minute = dateValue.getUTCMinutes();
    const second = dateValue.getUTCSeconds();
    const ms = dateValue.getUTCMilliseconds();

    return new Date(year, month, day, hour, minute, second, ms);
  }

  const dateString = String(dateValue).trim();
  const localDateString = dateString.replace(/Z$/, "");
  return new Date(localDateString);
}

function getElectionStatus(start_date, end_date) {
  const now = new Date();
  const start = parseLocalDate(start_date);
  const end = parseLocalDate(end_date);

  if (!start || !end || isNaN(start.getTime()) || isNaN(end.getTime())) {
    return "upcoming";
  }

  if (now < start) {
    return "upcoming";
  }
  if (now > end) {
    return "completed";
  }
  return "ongoing";
}

function getConstituencyStatus(
  electionStartDate,
  electionEndDate,
  constituencyStatus,
) {
  const now = new Date();

  if (constituencyStatus === "declared") {
    return "declared";
  }

  const start = parseLocalDate(electionStartDate);
  const end = parseLocalDate(electionEndDate);

  if (!start || isNaN(start.getTime())) {
    return "upcoming";
  }
  if (now < start) {
    return "upcoming";
  }
  if (end && now > end) {
    return "completed";
  }

  return "ongoing";
}

module.exports = {
  getTotalElections,
  getTotalCandidatesByElection,
  getTotalVotesByElection,
  getElectionStatus,
  getElectionTurnout,
  getTotalConstituencies,
  getConstituencyTurnout,
  getTotalCandidatesByConstituency,
  getTotalVotesByConstituency,
  getConstituencyStatus,
  getCandidateVotes,
  getConstituencyResultSnapshot,
  getRegisteredVotersByAdmin,
  getTotalConstituenciesByAdmin,
  getTotalVotersByAdmin,
};
