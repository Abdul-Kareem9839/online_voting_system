import { useState } from "react";
import { ArrowLeft, AlertCircle } from "lucide-react";
import CandidateCard from "./CandidateCard";
import FaceVerificationModal from "./FaceVerificationModal";

const VotingInterface = ({
  election,
  selectedCandidate,
  setSelectedCandidate,
  setVoteConfirmed,
  onBack,
  onSuccess,
}) => {
  const [showFace, setShowFace] = useState(false);

  const candidates = election?.constituency?.candidates ?? [];

  return (
    <div className="space-y-6">
      <div className="relative flex items-center gap-3">
        <button
          onClick={onBack}
          className="p-2 transition-opacity hover:opacity-60"
          aria-label="Go back"
        >
          <ArrowLeft size={18} style={{ color: "var(--ink)" }} />
        </button>

        <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center justify-center">
          <h2 className="font-display text-2xl" style={{ color: "var(--ink)" }}>
            {election.election_name}
          </h2>
          <p
            className="font-body text-xs mt-0.5"
            style={{ color: "var(--muted)" }}
          >
            {election.constituency?.constituency_name}
          </p>
        </div>
      </div>
      <div>
        <span
          className="font-display text-sm tracking-[0.25em] uppercase flex items-center justify-center"
          style={{ color: "var(--red)" }}
        >
          Official ballot
        </span>
      </div>
      {!showFace && (
        <>
          {/* Instruction strip */}
          <div
            className="flex items-start gap-3 p-4"
            style={{
              background: "#FAF4EC",
              border: "1px solid #E5DCC6",
            }}
          >
            <AlertCircle
              className="w-4 h-4 shrink-0 mt-0.5"
              style={{ color: "var(--muted)" }}
            />
            <p className="font-body text-xs" style={{ color: "var(--muted)" }}>
              Select one candidate from the list below. Once you confirm your
              vote it cannot be changed. Face verification is required before
              your vote is recorded.
            </p>
          </div>

          <div>
            {candidates.length === 0 ? (
              <div
                className="p-8 text-center font-body text-sm"
                style={{ color: "var(--muted)" }}
              >
                No candidates found for this constituency.
              </div>
            ) : (
              <div
                className="grid grid-cols-1 gap-5"
                style={{ borderColor: "var(--border)" }}
              >
                {candidates.map((c, index) => (
                  <CandidateCard
                    key={c.candidate_id}
                    candidate={c}
                    selected={selectedCandidate}
                    onSelect={(candidate) => setSelectedCandidate(candidate)}
                    index={index}
                  />
                ))}
              </div>
            )}
          </div>

          {selectedCandidate && (
            <div
              className="p-4"
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p
                    className="font-body text-xs uppercase tracking-wide"
                    style={{ color: "var(--muted)" }}
                  >
                    Your selection
                  </p>
                  <p
                    className="font-display text-lg mt-0.5"
                    style={{ color: "var(--ink)" }}
                  >
                    {selectedCandidate.candidate_name}
                  </p>
                  <p
                    className="font-body text-xs"
                    style={{ color: "var(--muted)" }}
                  >
                    {selectedCandidate.party || "Independent"}
                  </p>
                </div>

                <button
                  onClick={() => setSelectedCandidate(null)}
                  className="font-body text-xs underline transition-opacity hover:opacity-60"
                  style={{ color: "var(--red)" }}
                >
                  Change
                </button>
              </div>

              <button
                onClick={() => setShowFace(true)}
                className="btn"
                style={{ background: "var(--ink)", color: "var(--paper)" }}
              >
                Confirm and verify face →
              </button>
            </div>
          )}
        </>
      )}

      {showFace && (
        <FaceVerificationModal
          candidate={selectedCandidate}
          voter_id={election.voter_id}
          election_id={election.election_id}
          constituency_id={election.constituency?.constituency_id}
          onVerified={() => setVoteConfirmed(true)}
          onCancel={() => setShowFace(false)}
          onSuccess={onSuccess}
        />
      )}
    </div>
  );
};

export default VotingInterface;
