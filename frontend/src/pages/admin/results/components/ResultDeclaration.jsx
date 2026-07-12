import { useState } from "react";
import { AlertTriangle, X } from "lucide-react";
import { API_URL } from "../../../../../config/api";

const ResultDeclaration = ({ election, constituency, isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);

  const handleDeclareResult = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/results/declare-result`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          election_id: election.election_id,
          constituency_id: constituency.constituency_id,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to declare result");
      }

      setResponse({
        success: true,
        message: data.message,
      });
      onClose();
      window.location.reload();
    } catch (err) {
      setResponse({
        success: false,
        message: err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Success/Error Message */}
      {response && (
        <div
          className={`mb-4 rounded-lg p-4 border ${
            response.success
              ? "bg-green-50 border-green-200 text-green-700"
              : "bg-red-50 border-red-200 text-red-700"
          }`}
        >
          {response.message}
        </div>
      )}

      {/* Confirmation Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 backdrop-blur-sm animate-fade-in">
          <div className="card w-full max-w-md p-6 bg-surface border-light shadow-xl animate-scale-up">
            <div className="flex justify-between items-center mb-5">
              <div className="flex items-center gap-2 text-accent-gold">
                <AlertTriangle size={16} />
                <h2 className="font-display text-sm font-bold uppercase tracking-wider text-ink">
                  Confirm Result Declaration
                </h2>
              </div>

              <button
                onClick={() => onClose()}
                className="p-1 rounded text-muted hover:text-ink hover:bg-surface-alt transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-4">
              <p className="text-xs text-muted font-medium leading-relaxed">
                Are you sure you want to initialize the official declaration
                sequence for this designated constituency partition?
              </p>

              <div className="rounded-md bg-surface-alt p-4 border border-light text-xs space-y-1.5">
                <p className="text-muted font-medium">
                  <span className="font-bold uppercase tracking-wider text-[10px] inline-block w-24">
                    Election:
                  </span>
                  <span className="text-ink font-semibold">
                    {election.election_name}
                  </span>
                </p>

                <p className="text-muted font-medium">
                  <span className="font-bold uppercase tracking-wider text-[10px] inline-block w-24">
                    Constituency:
                  </span>{" "}
                  <span className="text-ink font-semibold">
                    {constituency.constituency_name}
                  </span>
                </p>
              </div>

              <div className="rounded-md bg-surface-alt border border-light border-dashed p-3 text-xs font-medium text-accent tracking-wide">
                Once declared, the execution parameters will lock into the
                analytics registry table and the state identifier updates
                permanently to{" "}
                <strong className="font-bold uppercase tracking-widest text-[10px] bg-surface px-1.5 py-0.5 rounded border border-light/50 ml-1">
                  declared
                </strong>
                .
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-light/40">
              <button
                onClick={() => onClose()}
                className="px-4 py-2 text-xs uppercase tracking-wider font-bold text-muted border border-light rounded-md hover:bg-surface-alt transition-colors"
              >
                Cancel
              </button>

              <button
                disabled={loading}
                onClick={handleDeclareResult}
                className="btn !w-auto px-4 py-2 text-xs uppercase tracking-wider font-bold rounded shadow-none transition-transform active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {loading ? "Declaring Ledger..." : "Confirm Declaration"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ResultDeclaration;
