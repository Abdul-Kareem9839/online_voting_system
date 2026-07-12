const Voter = require("../models/Voter");
const { getElectionStatus } = require("../models/functions");
const { getVoterDashboardStats } = require("../models/Voter");

const getElections = async () => {
  return await Voter.getUpcomingElections();
};

const getConstituencies = async (election_id) => {
  return await Voter.getConstituenciesByElectionId(election_id);
};

const getDashboard = async (email) => {
  const voter = await Voter.getByEmail(email);

  if (!voter) {
    throw new Error("Voter not found");
  }

  const electionsRaw = await Voter.getDashboardElections(email);

  const elections = electionsRaw.map((election) => ({
    ...election,
    status: getElectionStatus(election.start_date, election.end_date),
  }));

  const activeElection =
    elections.find(
      (election) => election.status === "ongoing" && election.registered_at,
    ) ||
    elections.find((election) => election.status === "ongoing") ||
    elections.find(
      (election) => election.status === "upcoming" && election.registered_at,
    ) ||
    elections.find((election) => election.status === "upcoming") ||
    elections.find((election) => election.registered_at) ||
    elections[0] ||
    null;

  const profileVoter = activeElection
    ? {
        ...voter,
        ...activeElection,
        voter_name: activeElection.voter_name ?? voter.voter_name,
        voter_id_number:
          activeElection.voter_id_number ?? voter.voter_id_number,
        face_registered:
          activeElection.face_registered ?? voter.face_registered,
        registered_at: activeElection.registered_at ?? voter.registered_at,
        constituency_name:
          activeElection.constituency_name ?? voter.constituency_name,
        election_id: activeElection.election_id,
        election_name: activeElection.election_name,
      }
    : voter;

  const stats = await getVoterDashboardStats(email);

  return {
    voter: profileVoter,
    stats,
    elections,
  };
};

module.exports = {
  getElections,
  getConstituencies,
  getDashboard,
};
