import { useState, useEffect } from "react";
import { Trash2, Plus, ArrowLeft } from "lucide-react";
import AddCandidate from "./AddCandidate";
import { API_URL } from "../../../../../config/api";

export default function CandidatesList({
  election_id,
  constituency_id,
  onBack,
}) {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddCandidate, setShowAddCandidate] = useState(false);

  const fetchCandidates = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        `${API_URL}/admins/elections/${election_id}/constituencies/${constituency_id}/candidates`,
        { credentials: "include" },
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      setCandidates(data.candidates);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, [election_id, constituency_id]);

  const handleDelete = async (candidate_id) => {
    if (!window.confirm("Are you sure you want to delete this candidate?"))
      return;

    try {
      const res = await fetch(
        `${API_URL}/admins/elections/${election_id}/constituencies/${constituency_id}/candidates/${candidate_id}`,
        { method: "DELETE", credentials: "include" },
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setCandidates((prev) =>
        prev.filter((c) => c.candidate_id !== candidate_id),
      );
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading)
    return <div className="text-center py-10">Loading candidates...</div>;

  if (showAddCandidate) {
    return (
      <AddCandidate
        election_id={election_id}
        constituency_id={constituency_id}
        onBack={() => setShowAddCandidate(false)}
        onSuccess={fetchCandidates}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Action Row */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-full hover:bg-surface-alt transition-colors"
          >
            <ArrowLeft size={18} className="text-ink" />
          </button>
          <h2 className="font-display text-2xl text-ink">Candidates</h2>
        </div>

        <button
          onClick={() => setShowAddCandidate(true)}
          className="flex items-center gap-2 px-4 py-2 bg-ink text-paper font-body text-xs font-medium rounded transition-colors hover:bg-neutral-800"
        >
          <Plus size={16} />
          Add Candidate
        </button>
      </div>

      {/* Main Content Area */}
      {candidates.length === 0 ? (
        <div
          className="dashboard-card p-12 text-center border-dashed"
          style={{ border: "2px dashed var(--surface-alt)" }}
        >
          <p className="font-body text-sm text-muted">No candidates found.</p>
        </div>
      ) : (
        <div className="dashboard-card p-0 overflow-hidden border border-gray-200 rounded-xl">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr
                  className="border-b border-gray-200"
                  style={{ background: "var(--surface-alt)" }}
                >
                  <th className="font-body text-xs uppercase tracking-wider text-muted p-4 font-medium w-20">
                    S.No.
                  </th>
                  <th className="font-body text-xs uppercase tracking-wider text-muted p-4 font-medium">
                    Candidate Name
                  </th>
                  <th className="font-body text-xs uppercase tracking-wider text-muted p-4 font-medium w-24 text-right pr-6">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {candidates.map((candidate, index) => (
                  <tr
                    key={candidate.candidate_id}
                    className="transition-colors hover:bg-surface-alt/50"
                  >
                    <td className="font-body text-sm text-muted p-4">
                      {index + 1}
                    </td>
                    <td className="font-body text-sm font-medium text-ink p-4">
                      {candidate.candidate_name}
                    </td>
                    <td className="p-4 text-right pr-6">
                      <button
                        onClick={() => handleDelete(candidate.candidate_id)}
                        className="text-muted hover:text-accent transition-colors p-1 rounded hover:bg-red-50"
                        title="Delete Candidate"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
