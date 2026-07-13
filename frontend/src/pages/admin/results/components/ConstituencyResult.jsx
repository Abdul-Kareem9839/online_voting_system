import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Trophy, CheckCircle } from "lucide-react";
import { API_URL } from "../../../../../config/api";
import { apiFetch } from "../../../../utils/apiFetch";
import ResultDeclaration from "./ResultDeclaration";
import CandidateRanking from "./CandidateRanking";
import VoteDistribution from "./VoteDistribution";

const ConstituencyResult = ({ election, constituency, onBack }) => {
  const [candidates, setCandidates] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);

  const fetchCandidates = async () => {
    try {
      const res = await apiFetch(
        `/admins/elections/${election.election_id}/constituencies/${constituency.constituency_id}/candidates`,
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      setCandidates(data.candidates);
    } catch (err) {
      alert(err.message);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, [election.election_id, constituency.constituency_id]);

  const isDeclared = constituency.status === "declared";
  const endDate = election?.end_date ? new Date(election.end_date) : null;
  const electionEnded = endDate ? new Date() > endDate : false;
  const canDeclare =
    candidates.length > 0 &&
    constituency.constituencyTurnout?.votesCast > 0 &&
    !isDeclared &&
    electionEnded;

  const getPercentage = (votes) => {
    const total = constituency.constituencyTurnout?.votesCast;
    if (!total || total === 0) return "0.0";
    return ((votes / total) * 100).toFixed(1);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="p-2 -ml-2 rounded-lg text-muted hover:text-ink hover:bg-surface-alt transition-colors"
            >
              <ArrowLeft size={18} />
            </button>
            <div>
              <h2 className="font-display text-2xl font-bold text-ink">
                {constituency.constituency_name}
              </h2>
              <p className="text-xs text-muted font-medium mt-0.5">
                {election.election_name}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="card p-5 bg-surface border-light">
            <p className="text-[10px] uppercase tracking-wider font-bold text-muted">
              Total Voters
            </p>
            <h3 className="font-display text-3xl font-bold text-ink mt-2">
              {constituency.constituencyTurnout?.totalVoters ?? 0}
            </h3>
          </div>

          <div className="card p-5 bg-surface border-light">
            <p className="text-[10px] uppercase tracking-wider font-bold text-muted">
              Votes Cast
            </p>
            <h3 className="font-display text-3xl font-bold text-ink mt-2">
              {constituency.constituencyTurnout?.votesCast ?? 0}
            </h3>
          </div>

          <div className="card p-5 bg-surface border-light">
            <p className="text-[10px] uppercase tracking-wider font-bold text-muted">
              Turnout
            </p>
            <h3 className="font-display text-3xl font-bold text-success mt-2">
              {constituency.constituencyTurnout?.turnout ?? "0%"}
            </h3>
          </div>

          <div className="card p-5 bg-surface border-light">
            <p className="text-[10px] uppercase tracking-wider font-bold text-muted">
              Candidates
            </p>
            <h3 className="font-display text-3xl font-bold text-ink mt-2">
              {candidates.length}
            </h3>
          </div>
        </div>

        <div className="card p-6 bg-surface-alt border border-light relative overflow-hidden">
          <div className="flex items-center gap-2.5 mb-5 text-ink">
            <Trophy size={18} className="text-accent-gold" />
            <h3 className="text-xs font-bold uppercase tracking-wider">
              Leading Candidate Status
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {constituency.constituencyTurnout?.votesCast > 0 ? (
              <>
                <div>
                  <p className="text-[10px] uppercase tracking-wider font-bold text-muted">
                    Candidate
                  </p>
                  <h2 className="text-lg font-bold text-ink mt-1">
                    {constituency.constituencyWinnerStats?.winner_name ?? "N/A"}
                  </h2>
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-wider font-bold text-muted">
                    Party affiliation
                  </p>
                  <h2 className="text-lg font-bold text-ink mt-1">
                    Independent / None
                  </h2>
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-wider font-bold text-muted">
                    Winning Margin
                  </p>
                  <h2 className="text-lg font-bold text-success mt-1 font-mono">
                    +{constituency.constituencyWinnerStats?.winning_margin ?? 0}{" "}
                    Votes
                  </h2>
                </div>
              </>
            ) : (
              <p className="text-xs text-muted font-medium col-span-3 italic">
                No records captured. Metrics ledger will evaluate parameters
                dynamically once configuration updates.
              </p>
            )}
          </div>
        </div>

        <CandidateRanking
          candidates={candidates}
          getPercentage={getPercentage}
          votesCast={constituency.constituencyTurnout?.votesCast ?? 0}
        />

        <div className="card p-6 bg-surface border-light">
          <h3 className="font-display text-base font-bold text-ink mb-6 section-divider">
            Vote Distribution
          </h3>
          <VoteDistribution
            candidates={candidates}
            getPercentage={getPercentage}
          />{" "}
        </div>

        <div className="card p-6 bg-surface border-light">
          <h3 className="font-display text-base font-bold text-ink mb-5 section-divider">
            Result Declaration
          </h3>

          <div className="bg-surface-alt/50 border border-light rounded-lg p-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {constituency.constituencyTurnout?.votesCast > 0 ? (
                <>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider font-bold text-muted">
                      Designated Winner
                    </p>
                    <h4 className="font-bold text-sm text-ink mt-1">
                      {constituency.constituencyWinnerStats?.winner_name ??
                        "N/A"}
                    </h4>
                  </div>

                  <div>
                    <p className="text-[10px] uppercase tracking-wider font-bold text-muted">
                      Final Margin Count
                    </p>
                    <h4 className="font-bold text-sm text-ink mt-1 font-mono">
                      {constituency.constituencyWinnerStats?.winning_margin ??
                        0}{" "}
                      Votes
                    </h4>
                  </div>
                </>
              ) : (
                <p className="text-xs text-muted font-medium col-span-2">
                  No votes cast yet. Action sequence will unlock when telemetry
                  verification completes.
                </p>
              )}
            </div>

            <button
              onClick={() => canDeclare && setShowConfirm(true)}
              disabled={!canDeclare}
              className={`w-full py-3 text-xs uppercase tracking-wider font-bold rounded-md flex items-center justify-center gap-2 border transition-all ${
                !canDeclare
                  ? "bg-surface-alt text-muted border-light/60 cursor-not-allowed opacity-60"
                  : isDeclared
                    ? "bg-surface-alt text-success border-light font-extrabold"
                    : "btn shadow-none transition-transform active:scale-[0.99]"
              }`}
            >
              <CheckCircle size={14} />
              {isDeclared
                ? "Result Officially Declared"
                : electionEnded
                  ? "Declare Final Result"
                  : "Declaration Locked Until Election End"}
            </button>
          </div>
        </div>
      </motion.div>
      <ResultDeclaration
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        election={election}
        constituency={constituency}
        onSuccess={fetchCandidates}
      />
    </>
  );
};

export default ConstituencyResult;
