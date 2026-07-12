import { User, CheckCircle2 } from "lucide-react";

const CandidateCard = ({ candidate, selected, onSelect, index }) => {
  const isSelected = selected?.candidate_id === candidate.candidate_id;

  return (
    <div
      onClick={() => onSelect(candidate)}
      className={`cursor-pointer transition-all duration-200 p-5 border-y border-r border-l-4 rounded-r-lg shadow-sm hover:bg-surface-alt/40 ${
        isSelected
          ? "bg-surface-alt border-ink border-l-ink"
          : "bg-paper border-gray-200 border-l-gray-300"
      }`}
    >
      <div className="flex items-center gap-4">
        <span
          className={`font-display text-2xl w-8 shrink-0 tracking-tighter ${
            isSelected ? "text-ink font-semibold" : "text-muted"
          }`}
        >
          {String(index + 1).padStart(2, "0")}
        </span>
        <div className="w-12 h-12 rounded-full shrink-0 flex items-center justify-center overflow-hidden bg-surface-alt border border-gray-200">
          {candidate.candidate_photo ? (
            <img
              src={candidate.candidate_photo}
              alt={candidate.candidate_name}
              className="w-full h-full object-cover"
            />
          ) : (
            <User className="w-5 h-5 text-muted" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-display text-base font-medium text-ink leading-tight truncate">
            {candidate.candidate_name}
          </p>
          <p className="font-body text-xs text-muted mt-0.5 truncate">
            {candidate.party || "Independent"}
          </p>
        </div>

        <div className="shrink-0 ml-2">
          {isSelected ? (
            <CheckCircle2 className="w-5 h-5 text-ink animate-fade-in" />
          ) : (
            <div className="w-5 h-5 rounded-full border border-gray-400 bg-paper" />
          )}
        </div>
      </div>
    </div>
  );
};

export default CandidateCard;
