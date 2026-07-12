import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../../../config/api";
import {
  Plus,
  Play,
  CheckCircle,
  Calendar,
  MapPin,
  Users,
  ArrowLeft,
} from "lucide-react";
import CreateElection from "./elections/CreateElection";
import ManageElections from "./elections/ManageElections";
import ElectionDetails from "./elections/ElectionDetails";
import EditElection from "./elections/ElectionEdit";

const ElectionsTab = ({ data }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [elections, setElections] = useState([]);
  const [selectedElection, setSelectedElection] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showElectionDetails, setShowElectionDetails] = useState(false);
  const [showElectionEdit, setShowElectionEdit] = useState(false);

  const fetchElections = async () => {
    try {
      const res = await fetch(`${API_URL}/admins/elections`, {
        credentials: "include",
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to fetch elections");

      setElections(data.elections);
    } catch (err) {
      console.error("Error fetching elections:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchElections();
  }, []);

  const getStatusConfig = (status) => {
    const config = {
      active: {
        color: "green",
        label: "Live",
        icon: <Play className="h-4 w-4" />,
      },
      upcoming: {
        color: "blue",
        label: "Upcoming",
        icon: <Calendar className="h-4 w-4" />,
      },
      completed: {
        color: "gray",
        label: "Completed",
        icon: <CheckCircle className="h-4 w-4" />,
      },
    };
    return config[status] || config.upcoming;
  };

  if (showElectionDetails && selectedElection) {
    return (
      <ElectionDetails
        election={selectedElection}
        onClose={() => {
          setShowElectionDetails(false);
          setSelectedElection(null);
        }}
      />
    );
  }

  if (showElectionEdit && selectedElection) {
    return (
      <EditElection
        election={selectedElection}
        onClose={() => {
          setShowElectionEdit(false);
          setSelectedElection(null);
          fetchElections();
        }}
      />
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center py-10">Loading elections...</div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="mb-5">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-xs font-semibold tracking-wide text-muted hover:text-ink transition-colors group"
        >
          <ArrowLeft
            size={14}
            className="text-muted group-hover:text-ink transition-colors"
          />
          <span>BACK</span>
        </button>
      </div>
      <div className="flex justify-between items-center mb-6 section-divider">
        <div>
          <h2 className="font-display text-xl font-bold text-ink">
            Election Management
          </h2>
          <p className="text-xs text-muted mt-0.5">
            Create and manage all elections
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="btn !w-auto px-5 !py-2 text-sm rounded shadow-none flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Create Election</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {elections.map((election) => {
          const statusConfig = getStatusConfig(election.status);
          return (
            <motion.div
              key={election.election_id}
              whileHover={{ y: -2 }}
              className="card p-5 cursor-pointer transition-all"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-display text-lg font-bold text-ink leading-tight">
                  {election.election_name}
                </h3>
                <span className="flex items-center space-x-1.5 text-xs font-semibold uppercase tracking-wider text-muted">
                  {statusConfig.icon}
                  <span>{statusConfig.label}</span>
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-xs text-muted">
                  <Calendar className="h-4 w-4 mr-2 text-ink shrink-0" />
                  <span>
                    {new Date(election.start_date).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex items-center text-xs text-muted">
                  <MapPin className="h-4 w-4 mr-2 text-ink shrink-0" />
                  <span>
                    {election.totalConstituencies || "No Constituency"}
                  </span>
                </div>
                <div className="flex items-center text-xs text-muted">
                  <Users className="h-4 w-4 mr-2 text-ink shrink-0" />
                  <span>{election.totalCandidates || "No"} candidates</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div
                  className="text-center p-3 rounded border bg-surface-alt"
                  style={{ borderColor: "var(--border)" }}
                >
                  <div className="font-display text-xl font-bold text-ink leading-tight">
                    {election.electionTurnout.totalVoters || "No voters"}
                  </div>
                  <div className="text-xs text-muted font-medium mt-0.5">
                    Voters
                  </div>
                </div>

                <div
                  className="text-center p-3 rounded border bg-surface-alt"
                  style={{ borderColor: "var(--border)" }}
                >
                  <div className="font-display text-xl font-bold text-ink leading-tight">
                    {election.electionTurnout.turnout}%
                  </div>
                  <div className="text-xs text-muted font-medium mt-0.5">
                    Turnout
                  </div>
                </div>
              </div>

              <ManageElections
                election={election}
                onView={() => {
                  setSelectedElection(election);
                  setShowElectionDetails(true);
                }}
                onEdit={() => {
                  setSelectedElection(election);
                  setShowElectionEdit(true);
                }}
                onDeleteSuccess={(deletedId) => {
                  setElections((prev) =>
                    prev.filter((e) => e.election_id !== deletedId),
                  );
                }}
              />
            </motion.div>
          );
        })}
      </div>

      {showCreateModal && (
        <CreateElection
          admin_id={data?.admin_id}
          onClose={() => {
            setShowCreateModal(false);
            fetchElections();
          }}
        />
      )}
    </motion.div>
  );
};

export default ElectionsTab;
