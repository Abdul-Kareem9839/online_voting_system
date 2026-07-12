import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import ConstituenciesList from "../constituencies/ConstituenciesList";
import UploadVotersSection from "../voters/UploadVotersSection";

export default function ElectionDetails({ election, onClose }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [showUploadVoter, setShowUploadVoter] = useState(false);

  if (!election) {
    return (
      <div className="flex justify-center items-center h-screen">
        Election not found
      </div>
    );
  }

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "constituencies", label: "Constituencies" },
    { id: "voters", label: "Voters" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-4">
      <div className="mb-5">
        <button
          onClick={() => onClose()}
          className="flex items-center gap-2 text-xs font-semibold tracking-wide text-muted hover:text-ink transition-colors group"
        >
          <ArrowLeft
            size={14}
            className="text-muted group-hover:text-ink transition-colors"
          />
          <span>BACK</span>
        </button>
      </div>

      <div className="card p-8 mb-8 bg-surface border-light">
        <div className="flex flex-col justify-between md:items-start gap-6">
          <div>
            <h1 className="font-display text-3xl font-bold tracking-tight text-ink">
              {election.election_name}
            </h1>
          </div>
          <div className="mt-0 flex items-center justify-between w-full gap-4">
            <p className="text-xs text-muted font-medium flex items-center gap-1">
              Election ID:
              <span className="font-mono text-ink bg-surface-alt px-2 py-0.5 rounded font-semibold">
                {election.election_id}
              </span>
            </p>

            <span className="inline-flex items-center ml-auto px-3 py-1 text-xs font-bold uppercase tracking-wider text-success bg-surface-alt border border-light rounded-md shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-sage mr-2 animate-pulse"></span>
              {election.status || "active"}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 mt-6 gap-4">
          <div
            className="card p-4 rounded-lg transition-all "
            style={{ borderTopColor: "var(--accent-gold)" }}
          >
            <p className="text-[10px] font-body uppercase tracking-wider font-bold text-muted">
              Election Type
            </p>
            <p className="text-base font-body font-semibold text-ink mt-1 capitalize">
              {election.election_type}
            </p>
          </div>

          <div
            className="card p-4 rounded-lg transition-all "
            style={{ borderTopColor: "var(--accent-sage)" }}
          >
            <p className="text-[10px] font-body uppercase tracking-wider font-bold text-muted">
              Start Date
            </p>
            <p className="text-base font-body font-semibold text-ink mt-1">
              {new Date(election.start_date).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </p>
          </div>

          <div
            className="card p-4 rounded-lg transition-all "
            style={{ borderTopColor: "var(--accent-blue)" }}
          >
            <p className="text-[10px] font-body uppercase tracking-wider font-bold text-muted">
              End Date
            </p>
            <p className="text-base font-body font-semibold text-ink mt-1">
              {new Date(election.end_date).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </p>
          </div>

          <div
            className="card p-4 rounded-lg transition-all"
            style={{ borderTopColor: "var(--accent-stone)" }}
          >
            <p className="text-[10px] font-body uppercase tracking-wider font-bold text-muted">
              Current State
            </p>
            <p className="text-base font-body font-semibold text-ink mt-1 capitalize">
              {election.status || "Active"}
            </p>
          </div>
        </div>
      </div>

      <div className="card overflow-hidden bg-surface border-light">
        <div className="border-b border-light bg-surface-alt/60 px-6">
          <div className="flex space-x-8 overflow-x-auto scrollbar-none">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 text-xs font-bold uppercase tracking-widest transition-all relative border-b-2 -mb-[1px] ${
                  activeTab === tab.id
                    ? "text-ink border-ink font-extrabold"
                    : "text-muted border-transparent hover:text-ink"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-8 min-h-[380px]">
          {activeTab === "overview" && (
            <div className="animate-fade-in">
              <h2 className="font-display text-xl font-bold text-ink mb-6 section-divider">
                Election Overview
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
                <div className="bg-surface-alt border border-light p-5 rounded-lg transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
                  <h3 className="text-[10px] uppercase tracking-wider font-bold text-muted">
                    Constituencies
                  </h3>
                  <p className="font-display text-4xl font-bold text-ink mt-2">
                    {election.totalConstituencies || 0}
                  </p>
                </div>

                <div className="bg-surface-alt border border-light p-5 rounded-lg transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
                  <h3 className="text-[10px] uppercase tracking-wider font-bold text-muted">
                    Candidates
                  </h3>
                  <p className="font-display text-4xl font-bold text-ink mt-2">
                    {election.totalCandidates || 0}
                  </p>
                </div>

                <div className="bg-surface-alt border border-light p-5 rounded-lg transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
                  <h3 className="text-[10px] uppercase tracking-wider font-bold text-muted">
                    Total Voters
                  </h3>
                  <p className="font-display text-4xl font-bold text-ink mt-2">
                    {election.electionTurnout?.totalVoters || 0}
                  </p>
                </div>

                <div className="bg-surface-alt border border-light p-5 rounded-lg transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
                  <h3 className="text-[10px] uppercase tracking-wider font-bold text-muted">
                    Votes Cast
                  </h3>
                  <p className="font-display text-4xl font-bold text-ink mt-2">
                    {election.electionTurnout?.votesCast || 0}
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "constituencies" && (
            <div className="animate-fade-in">
              <ConstituenciesList
                election_id={election.election_id}
                onClose={onClose}
              />
            </div>
          )}

          {activeTab === "voters" && (
            <div className="animate-fade-in">
              {!showUploadVoter && (
                <div className="flex justify-between items-center mb-6">
                  <h2 className="font-display text-xl font-bold text-ink">
                    Voters
                  </h2>
                  <button
                    onClick={() => setShowUploadVoter(true)}
                    className="btn !w-auto px-4 text-xs"
                  >
                    + Upload Voters
                  </button>
                </div>
              )}

              {showUploadVoter ? (
                <UploadVotersSection
                  election_id={election.election_id}
                  onClose={() => setShowUploadVoter(false)}
                  showUploadVoter={showUploadVoter}
                  setShowUploadVoter={setShowUploadVoter}
                />
              ) : (
                <p className="text-xs text-muted font-medium bg-surface-alt/40 border border-light border-dashed p-8 rounded-lg text-center">
                  Voters database ledger is currently empty. Click above to
                  populate.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
