import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { API_URL } from "../../../../config/api";
import LiveElectionCard from "./components/LiveElectionCard";
import UpcomingElectionCard from "./components/UpcomingElectionCard";
import VotingInterface from "./components/VotingInterface";
import VoteConfirmation from "./components/VoteConfirmation";

const ElectionsTab = () => {
  const [loading, setLoading] = useState(true);
  const [selectedElection, setSelectedElection] = useState(null);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [voteConfirmed, setVoteConfirmed] = useState(false);
  const [data, setData] = useState({
    constituencies: [],
    elections: [],
  });

  const loadElectionData = async () => {
    try {
      const response = await fetch(`${API_URL}/voters/dashboard/electionTab`, {
        credentials: "include",
      });

      const fetchedPayload = await response.json();

      if (!response.ok) {
        throw new Error(
          fetchedPayload.message || "Failed to fetch election data",
        );
      }

      setData(fetchedPayload);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadElectionData();
  }, []);

  const startVoting = (election) => {
    setSelectedElection(election);
  };

  const resetVoting = () => {
    setSelectedElection(null);
    setSelectedCandidate(null);
    setVoteConfirmed(false);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4 bg-white rounded-xl shadow-sm p-6">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600"></div>
        <p className="text-gray-500 font-medium">
          Loading your elections data...
        </p>
      </div>
    );
  }

  if (voteConfirmed) {
    return (
      <VoteConfirmation
        candidate={selectedCandidate}
        election={selectedElection}
        onReturn={resetVoting}
      />
    );
  }

  if (selectedElection) {
    return (
      <VotingInterface
        election={selectedElection}
        data={data}
        selectedCandidate={selectedCandidate}
        setSelectedCandidate={setSelectedCandidate}
        setVoteConfirmed={setVoteConfirmed}
        onBack={resetVoting}
        onSuccess={loadElectionData}
      />
    );
  }

  const activeElections =
    data?.elections?.filter((e) => e.status === "ongoing") || [];
  const upcomingElections =
    data?.elections?.filter((e) => e.status === "upcoming") || [];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div className="dashboard-card p-6">
        <div className="section-divider mb-6">
          <h2 className="font-display text-2xl text-ink">My Elections</h2>
        </div>

        {/* LIVE SECTION */}
        <div className="mb-8">
          <h3 className="font-display text-base font-semibold mb-4 text-success">
            Live Elections
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activeElections.length > 0 ? (
              activeElections.map((e) => (
                <LiveElectionCard
                  key={e.election_id || e.election_name}
                  election={e}
                  onVote={startVoting}
                />
              ))
            ) : (
              <div
                className="col-span-2 p-6 text-center rounded"
                style={{
                  border: "1px dashed var(--surface-alt)",
                  background: "var(--paper)",
                }}
              >
                <p className="font-body text-xs text-muted">
                  There are no active elections running in your constituency
                  right now.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* UPCOMING SECTION */}
        <div>
          <h3 className="font-display text-base font-semibold mb-4 text-accent">
            Upcoming Elections
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {upcomingElections.length > 0 ? (
              upcomingElections.map((e) => (
                <UpcomingElectionCard
                  key={e.election_id || e.election_name}
                  election={e}
                />
              ))
            ) : (
              <div
                className="col-span-2 p-6 text-center rounded"
                style={{
                  border: "1px dashed var(--surface-alt)",
                  background: "var(--paper)",
                }}
              >
                <p className="font-body text-xs text-muted">
                  No upcoming elections scheduled yet.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ElectionsTab;
