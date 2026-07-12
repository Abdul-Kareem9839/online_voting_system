import { Award } from "lucide-react";

export default function CandidateRanking({
  getPercentage,
  candidates,
  votesCast,
}) {
  const hasVotes = votesCast > 0;

  return (
    <div className="card p-6 bg-surface border-light">
      <h3 className="font-display text-base font-bold text-ink mb-6 section-divider">
        Candidate Rankings
      </h3>

      <div className="space-y-3">
        {candidates.map((candidate, index) => {
          const isWinner = hasVotes && index === 0;
          return (
            <div
              key={candidate.candidate_id}
              className={`border rounded-lg p-4 transition-all duration-200 ${
                isWinner
                  ? "border-success bg-surface-alt"
                  : "border-light bg-surface/40 hover:bg-surface-alt/30"
              }`}
            >
              <div className="flex justify-between items-center gap-4">
                <div className="flex items-center gap-4">
                  <div
                    className={`h-10 w-10 rounded-md border flex items-center justify-center font-mono text-xs font-bold ${
                      isWinner
                        ? "bg-surface text-accent-gold border-light"
                        : "bg-surface-alt text-muted border-light/60"
                    }`}
                  >
                    {isWinner ? (
                      <Award size={16} className="text-accent-gold" />
                    ) : (
                      <span>#{index + 1}</span>
                    )}
                  </div>

                  <div>
                    <h4 className="font-semibold text-sm text-ink leading-none">
                      {candidate.candidate_name}
                    </h4>
                    <p className="text-[10px] uppercase tracking-wider font-bold text-muted mt-1">
                      Independent
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  {hasVotes ? (
                    <>
                      <h4 className="font-mono text-base font-bold text-ink leading-none">
                        {candidate.totalVotes.toLocaleString("en-IN")}
                      </h4>
                      <p className="text-[10px] font-mono font-bold text-muted bg-surface-alt px-1.5 py-0.5 rounded border border-light/50 inline-block mt-1">
                        {getPercentage(candidate.totalVotes)}%
                      </p>
                    </>
                  ) : (
                    <span className="text-xs font-medium text-muted/60 italic">
                      No metrics logged
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
