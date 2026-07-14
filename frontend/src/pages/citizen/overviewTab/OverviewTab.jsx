import { motion } from "framer-motion";
import {
  Vote,
  CheckCircle2,
  Clock,
  AlertCircle,
  Calendar,
  TrendingUp,
} from "lucide-react";

const OverviewTab = ({ data }) => {
  if (!data || !data.voter) {
    return (
      <div className="dashboard-card p-6 text-center">
        <p className="font-body text-sm text-muted">Loading overview...</p>
      </div>
    );
  }

  const { voter, stats, elections } = data;

  const activeElections =
    elections?.filter((e) => e.status === "ongoing") ?? [];
  const upcomingElections =
    elections?.filter((e) => e.status === "upcoming") ?? [];

  const voterStats = [
    {
      icon: <Vote className="h-5 w-5" />,
      title: "Total Elections",
      value: stats?.totalElections ?? 0,
      description: "You are registered in",
      accentClass: "text-ink",
      borderColor: "var(--ink)",
    },
    {
      icon: <Clock className="h-5 w-5" />,
      title: "Active Elections",
      value: stats?.activeElections ?? 0,
      description: "Currently running",
      accentClass: "text-success",
      borderColor: "var(--sage)",
    },
    {
      icon: <CheckCircle2 className="h-5 w-5" />,
      title: "Votes Cast",
      value: stats?.votesCast ?? 0,
      description: "Elections participated",
      accentClass: "text-accent",
      borderColor: "var(--red)",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="bg-ink p-6 rounded-xl">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-2xl mt-1 text-paper">
              Welcome back, {voter.voter_name}
            </h2>
            <p
              className="font-body text-sm mt-1 text-muted"
              style={{ color: "#9C9A8E" }}
            >
              Here's a summary of your voting activity today.
            </p>
          </div>
          <div
            className="p-3 hidden md:block"
            style={{ border: "1px solid rgba(237,234,227,0.15)" }}
          >
            <TrendingUp className="h-6 w-6 text-paper" />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {voterStats.map((stat, index) => (
          <div
            key={index}
            className="dashboard-card"
            style={{ borderLeft: `3px solid ${stat.borderColor}` }}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="font-body text-xs uppercase tracking-wide text-muted">
                  {stat.title}
                </p>
                <p className="font-display text-3xl mt-1">{stat.value}</p>
                <p className="font-body text-xs mt-1 text-muted">
                  {stat.description}
                </p>
              </div>
              <div className={stat.accentClass}>{stat.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {activeElections.length > 0 || upcomingElections.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Active Elections */}
          {activeElections.length > 0 && (
            <div className="dashboard-card">
              <div className="section-divider flex items-center gap-2">
                <AlertCircle size={18} className="text-success" />
                <h3 className="font-display text-lg">Elections in Progress</h3>
              </div>
              <div className="space-y-3">
                {activeElections.map((e) => (
                  <div
                    key={e.election_id}
                    className="flex items-center justify-between p-3 rounded"
                    style={{ background: "#EEF3EB" }}
                  >
                    <span
                      className="font-body text-sm font-medium"
                      style={{ color: "var(--sage)" }}
                    >
                      {e.election_name}
                    </span>
                    <span
                      className="font-body text-xs px-2 py-1 rounded font-medium"
                      style={{
                        background: e.has_voted
                          ? "rgba(40, 167, 69, 0.1)"
                          : "rgba(220, 53, 69, 0.1)",
                        color: e.has_voted ? "var(--sage)" : "var(--red)",
                      }}
                    >
                      {e.has_voted ? "Voted ✓" : "Not Voted Yet"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upcoming Elections */}
          {upcomingElections.length > 0 && (
            <div className="dashboard-card">
              <div className="section-divider flex items-center gap-2">
                <Calendar size={18} className="text-ink" />
                <h3 className="font-display text-lg">Upcoming Elections</h3>
              </div>
              <div className="space-y-3">
                {upcomingElections.map((e) => (
                  <div
                    key={e.election_id}
                    className="flex items-center justify-between p-3 rounded"
                    style={{ background: "#EAF0F8" }}
                  >
                    <span
                      className="font-body text-sm font-medium"
                      style={{ color: "var(--ink)" }}
                    >
                      {e.election_name}
                    </span>
                    <span className="font-body text-xs text-muted">
                      Starts {new Date(e.start_date).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Empty State */
        <div
          className="dashboard-card p-8 text-center border-dashed"
          style={{ border: "2px dashed var(--surface-alt)" }}
        >
          <p className="font-body text-sm text-muted">
            No active or upcoming elections at the moment.
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default OverviewTab;
