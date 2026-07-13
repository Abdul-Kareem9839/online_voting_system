import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, Award, BarChart2, Loader2 } from "lucide-react";
import { apiFetch } from "../../../utils/apiFetch";

const HistoryTab = ({ data }) => {
  const elections = data?.elections || [];

  const [selectedElection, setSelectedElection] = useState(null);
  const [candidates, setCandidates] = useState([]);
  const [loadingResults, setLoadingResults] = useState(false);

  const completedElections = elections.filter(
    (e) =>
      e.status === "completed" ||
      e.constituency_status === "declared" ||
      e.status === "declared",
  );

  useEffect(() => {
    if (!selectedElection) {
      setCandidates([]);
      return;
    }

    const fetchConstituencyResults = async () => {
      setLoadingResults(true);
      try {
        const electionId = selectedElection.election_id;
        const constituencyId = selectedElection.constituency_id;

        if (!constituencyId) {
          throw new Error("Constituency profile not found.");
        }

        const res = await apiFetch(
          `/voters/elections/${electionId}/my-constituency-results`,
        );

        const resData = await res.json();
        if (!res.ok) {
          throw new Error(
            resData.message || "Failed to load constituency results",
          );
        }

        const sortedCandidates = (resData.candidates || []).sort(
          (a, b) => (b.votes || 0) - (a.votes || 0),
        );
        setCandidates(sortedCandidates);
      } catch (err) {
        alert(err.message || "Failed to load constituency results");
        setSelectedElection(null);
      } finally {
        setLoadingResults(false);
      }
    };

    fetchConstituencyResults();
  }, [selectedElection]);

  const getPercentage = (votes) => {
    const totalVotes = candidates.reduce((sum, c) => sum + (c.votes || 0), 0);
    if (!totalVotes) return "0.0";
    return ((votes / totalVotes) * 100).toFixed(1);
  };

  const winner = candidates[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="dashboard-card">
        <div className="section-divider">
          <h2 className="font-display text-xl text-ink">Voting History</h2>
        </div>

        {completedElections.length === 0 ? (
          <p className="font-body text-sm text-muted">
            No completed elections yet.
          </p>
        ) : (
          <div className="space-y-4">
            {completedElections.map((election) => {
              const isConstituencyDeclared =
                election.constituency_status === "declared" ||
                election.status === "declared";

              return (
                <div
                  key={election.election_id}
                  className={`group flex flex-col sm:flex-row sm:items-center justify-between p-5 border rounded-xl transition-all duration-200 ${
                    isConstituencyDeclared
                      ? "bg-slate-50/50 border-slate-200/60 shadow-sm"
                      : "bg-[#fdfbf7] border-stone-200/60 hover:border-stone-300 hover:bg-[#fcfaf4]"
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <h4 className="font-body font-bold text-slate-900 text-base tracking-tight transition-colors">
                        {election.election_name}
                      </h4>

                      {isConstituencyDeclared && (
                        <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-800 border border-slate-200 text-[10px] font-bold px-2.5 py-0.5 rounded-md uppercase tracking-wider shadow-sm animate-pulse-slow">
                          <span className="w-1 h-1 rounded-full bg-slate-600"></span>
                          Result Declared
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-x-2 text-xs text-stone-500 font-body font-medium">
                      <span>{election.election_type}</span>
                      <span className="text-stone-300">•</span>
                      <span className="text-stone-700 bg-stone-100 px-2 py-0.5 rounded text-[11px]">
                        {election.constituency_name}
                      </span>
                      <span className="text-stone-300 hidden sm:inline">•</span>
                      <span className="text-stone-400 font-normal block sm:inline mt-0.5 sm:mt-0">
                        Ended{" "}
                        {new Date(election.end_date).toLocaleDateString(
                          undefined,
                          { month: "short", day: "numeric", year: "numeric" },
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 mt-4 sm:mt-0 self-end sm:self-auto border-t sm:border-t-0 pt-3 sm:pt-0 border-stone-100 w-full sm:w-auto justify-end">
                    <div
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-body text-xs font-semibold tracking-wide border shadow-sm ${
                        election.has_voted
                          ? "bg-emerald-50/50 text-emerald-800 border-emerald-200/60"
                          : "bg-rose-50/40 text-rose-800 border-rose-900/20"
                      }`}
                    >
                      {election.has_voted ? (
                        <>
                          <CheckCircle2 size={13} strokeWidth={2.5} />
                          <span>Voted</span>
                        </>
                      ) : (
                        <>
                          <XCircle size={13} strokeWidth={2.5} />
                          <span>Not Voted</span>
                        </>
                      )}
                    </div>

                    {isConstituencyDeclared && (
                      <button
                        onClick={() => setSelectedElection(election)}
                        className="btn text-xs flex px-2 items-center justify-center"
                      >
                        <BarChart2 size={13} strokeWidth={2.5} />
                        View Results
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <AnimatePresence>
        {selectedElection && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#fcfaf4] rounded-xl shadow-xl max-w-md w-full max-h-[85vh] flex flex-col overflow-hidden border border-stone-200/60"
            >
              <div className="p-5 border-b border-stone-200/60 flex justify-between items-start bg-white/50">
                <div>
                  <span className="text-[11px] font-bold text-slate-800 bg-slate-100 px-2.5 py-0.5 rounded-md uppercase tracking-wider border border-slate-200/60">
                    {selectedElection.constituency_name} Outcome
                  </span>
                  <h3 className="font-display text-lg text-slate-900 font-bold mt-2">
                    {selectedElection.election_name}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedElection(null)}
                  className="text-stone-400 hover:text-slate-900 text-sm p-1 transition-colors"
                >
                  ✕
                </button>
              </div>

              <div className="p-5 overflow-y-auto flex-1 min-h-[200px] bg-white/30">
                {loadingResults ? (
                  <div className="flex flex-col items-center justify-center h-40 gap-2 text-stone-400">
                    <Loader2
                      size={24}
                      className="animate-spin text-stone-500"
                    />
                    <p className="text-xs font-body">
                      Fetching constituency results...
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {winner && winner.votes > 0 && (
                      <div className="bg-[#f7f3e8] border border-amber-900/10 rounded-lg p-4 flex items-start gap-3 shadow-sm">
                        <div className="p-2 bg-amber-700/90 rounded-lg text-white mt-0.5 shadow-sm">
                          <Award size={18} />
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-amber-800/90 uppercase tracking-wider block">
                            Constituency Winner
                          </span>
                          <h4 className="font-body font-bold text-slate-900 text-base mt-0.5">
                            {winner.name || winner.candidate_name}
                          </h4>
                          <p className="font-body text-xs text-stone-600 mt-1">
                            Won with{" "}
                            <span className="font-semibold text-slate-900">
                              {getPercentage(winner.votes)}%
                            </span>{" "}
                            of votes ({winner.votes} votes)
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="space-y-4">
                      <h5 className="font-body text-[11px] font-bold text-stone-400 uppercase tracking-wider">
                        Local Vote Breakdown
                      </h5>
                      <div className="space-y-3.5">
                        {candidates.map((candidate, idx) => {
                          const isWinner = idx === 0 && candidate.votes > 0;
                          const pct = getPercentage(candidate.votes);
                          return (
                            <div
                              key={
                                candidate.id || candidate.candidate_id || idx
                              }
                              className="space-y-1.5"
                            >
                              <div className="flex justify-between items-center text-sm font-body">
                                <span
                                  className={`font-medium ${isWinner ? "text-slate-900 font-bold" : "text-stone-700"}`}
                                >
                                  {candidate.name || candidate.candidate_name}{" "}
                                  {isWinner && "🏆"}
                                </span>
                                <span className="text-xs text-stone-500 font-mono font-medium">
                                  {candidate.votes || 0} votes ({pct}%)
                                </span>
                              </div>
                              <div className="h-2 w-full bg-stone-100 rounded-full overflow-hidden border border-stone-200/40">
                                <div
                                  className={`h-full rounded-full transition-all duration-500 ${isWinner ? "bg-amber-600" : "bg-stone-400"}`}
                                  style={{ width: `${pct}%` }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-4 bg-stone-50/50 border-t border-stone-200/60 flex justify-end">
                <button
                  onClick={() => setSelectedElection(null)}
                  className="px-4 py-2 bg-white border border-stone-200 rounded-lg text-xs font-semibold text-stone-700 hover:bg-stone-50 hover:text-slate-900 transition-colors shadow-sm"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>{" "}
    </motion.div>
  );
};

export default HistoryTab;
