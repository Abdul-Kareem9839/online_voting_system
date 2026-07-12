import { Eye } from "lucide-react";
import { motion } from "framer-motion";

const STATUS_STYLES = {
  declared: "text-success bg-success/10 border-success",
  completed: "text-ink bg-surface-alt border-light",
  ongoing: "text-accent-gold bg-surface-alt border-light",
  upcoming: "text-muted bg-surface-alt border-light",
};

const STATUS_LABELS = {
  declared: "Declared",
  completed: "Election Completed",
  ongoing: "Voting Ongoing",
  upcoming: "Upcoming",
};

export default function ConstituencyCard({
  constituency,
  isDeclared,
  onViewConstituency,
}) {
  const statusLabel = STATUS_LABELS[constituency.status] || constituency.status;
  const statusClasses =
    STATUS_STYLES[constituency.status] ||
    "text-accent-gold bg-surface-alt border-light";

  return (
    <motion.div
      key={constituency.constituency_id}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className="card p-6 bg-surface border-light flex flex-col justify-between"
    >
      <div>
        <div className="flex items-start justify-between gap-4 mb-5">
          <div>
            <h3 className="font-display text-base font-bold text-ink leading-snug">
              {constituency.constituency_name}
            </h3>
            <p className="text-[10px] font-mono font-bold text-muted uppercase tracking-wider mt-1">
              ID: {constituency.constituency_id}
            </p>
          </div>

          <span
            className={`inline-flex items-center px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider border rounded-md ${statusClasses}`}
          >
            {!isDeclared && constituency.status === "ongoing" && (
              <span className="w-1 h-1 rounded-full bg-accent-gold mr-1.5 animate-pulse"></span>
            )}
            {statusLabel}
          </span>
        </div>

        <div className="space-y-2.5 mb-6 text-xs pt-1 border-t border-light/40">
          <div className="flex justify-between items-center">
            <span className="text-muted font-medium">Total Voters</span>
            <span className="font-mono font-semibold text-ink">
              {constituency.constituencyTurnout?.totalVoters?.toLocaleString(
                "en-IN",
              )}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-muted font-medium">Votes Cast</span>
            <span className="font-mono font-semibold text-ink">
              {constituency.constituencyTurnout?.votesCast?.toLocaleString(
                "en-IN",
              )}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-muted font-medium">Turnout</span>
            <span className="font-mono font-bold text-ink">
              {constituency.constituencyTurnout?.turnout}%
            </span>
          </div>

          {isDeclared && (
            <div className="flex justify-between items-center p-2 border-t border-dashed border-light mt-2">
              <span className="text-muted font-bold uppercase text-[10px] tracking-wide">
                Declared Winner
              </span>
              <span className="font-bold text-success text-xs bg-surface-alt px-2 py-0.5 rounded border border-light/50">
                {constituency.constituencyWinnerStats?.winner_name ?? "N/A"}
              </span>
            </div>
          )}
        </div>
      </div>

      <button
        onClick={() => onViewConstituency(constituency)}
        className="btn flex items-center justify-center space-x-2 text-xs uppercase tracking-wider font-bold !py-2.5 rounded shadow-none transition-transform active:scale-[0.98]"
      >
        <Eye size={14} />
        <span>{isDeclared ? "View Result" : "Manage Result"}</span>
      </button>
    </motion.div>
  );
}
