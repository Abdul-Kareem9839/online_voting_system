import { motion } from "framer-motion";
import { Eye } from "lucide-react";

const ElectionCard = ({ election, setSelectedElection }) => {
  const isLive = election.status === "ongoing";

  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="card p-6 bg-surface border-light flex flex-col justify-between h-full transition-all duration-200"
    >
      <div>
        <div className="flex justify-between items-start gap-4 mb-5">
          <h3 className="font-display text-lg font-bold text-ink leading-snug">
            {election.election_name}
          </h3>

          <span
            className={`inline-flex items-center px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider border rounded-md ${
              isLive
                ? "text-success bg-surface-alt border-light"
                : "text-muted bg-surface-alt/50 border-light/60"
            }`}
          >
            {isLive && (
              <span className="w-1 h-1 rounded-full bg-sage mr-1.5 animate-pulse"></span>
            )}
            {isLive ? "Ongoing" : "Completed"}
          </span>
        </div>

        <div className="space-y-2.5 mb-6 pt-1">
          <div className="flex justify-between items-center text-xs">
            <span className="text-muted font-medium">Election Type:</span>
            <span className="font-semibold text-ink capitalize">
              {election.election_type}
            </span>
          </div>

          <div className="flex justify-between items-center text-xs">
            <span className="text-muted font-medium">Start Date:</span>
            <span className="font-mono font-semibold text-ink">
              {new Date(election.start_date).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>

          <div className="flex justify-between items-center text-xs">
            <span className="text-muted font-medium">End Date:</span>
            <span className="font-mono font-semibold text-ink">
              {new Date(election.end_date).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-auto">
        <button
          onClick={() => setSelectedElection(election)}
          className="btn flex items-center justify-center space-x-2 text-xs uppercase tracking-wider font-bold !py-2.5 rounded shadow-none transition-transform active:scale-[0.98]"
        >
          <Eye className="h-3.5 w-3.5" />
          <span>
            {election.status === "completed" || election.status === "declared"
              ? "View Results"
              : "Manage Results"}
          </span>
        </button>
      </div>
    </motion.div>
  );
};

export default ElectionCard;
