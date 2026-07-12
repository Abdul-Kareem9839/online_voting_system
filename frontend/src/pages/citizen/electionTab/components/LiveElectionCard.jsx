import { motion } from "framer-motion";
import { Calendar, MapPin, Clock, CheckCircle2 } from "lucide-react";

const LiveElectionCard = ({ election, onVote }) => {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="dashboard-card"
      style={{ borderLeft: "3px solid var(--sage)" }}
    >
      <h3 className="font-display text-lg text-ink">
        {election.election_name}
      </h3>

      <div className="font-body text-xs text-muted mt-3 space-y-2">
        <div className="flex items-center gap-1.5">
          <Clock className="w-4 h-4 text-success" />
          <span className="font-medium text-success">Live Now</span>
        </div>

        <div className="flex items-center gap-1.5">
          <Calendar className="w-4 h-4" />
          <span>Ends: {new Date(election.end_date).toLocaleDateString()}</span>
        </div>

        <div className="flex items-center gap-1.5">
          <MapPin className="w-4 h-4" />
          <span>{election.constituency?.constituency_name}</span>
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-gray-100 flex justify-between items-center">
        <span className="font-body text-xs text-muted">
          Candidates available
        </span>

        {!election.has_voted ? (
          <button
            onClick={() => {
              if (onVote) onVote(election);
            }}
            className="bg-ink text-paper font-body text-xs font-medium px-4 py-2 rounded transition-colors hover:bg-neutral-800"
          >
            Vote Now
          </button>
        ) : (
          <div
            className="flex items-center gap-1 font-body text-xs font-medium"
            style={{ color: "var(--sage)" }}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Voteddd</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default LiveElectionCard;
