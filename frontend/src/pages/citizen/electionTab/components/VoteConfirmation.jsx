import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

const VoteSuccessCard = ({ candidate, election, onReturn }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="dashboard-card p-8 text-center max-w-xl mx-auto"
    >
      <CheckCircle2 className="w-12 h-12 text-success mx-auto mb-4" />

      <p className="font-body text-sm text-muted mt-3">
        Your vote for{" "}
        <strong className="text-ink font-semibold">
          {candidate?.candidate_name}
        </strong>{" "}
        in{" "}
        <strong className="text-ink font-semibold">
          {election?.election_name}
        </strong>{" "}
        has been securely recorded.
      </p>

      <div className="mt-5 rounded-lg border border-light bg-surface-alt p-4 text-left text-xs text-muted space-y-2">
        <p>• You cannot cast another vote in this election.</p>
        <p>• Your ballot remains confidential and cannot be changed.</p>
        <p>
          • Official results will be available after the election is closed and
          results are declared.
        </p>
      </div>

      <button
        onClick={onReturn}
        className="bg-ink text-paper font-body text-xs font-medium px-6 py-3 rounded transition-colors hover:bg-neutral-800"
      >
        Return to Elections
      </button>
    </motion.div>
  );
};

export default VoteSuccessCard;
