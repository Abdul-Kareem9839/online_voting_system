import { useEffect, useState } from "react";
import { Trash2, Pencil } from "lucide-react";
import { API_URL } from "../../../../../config/api";
import { apiFetch } from "../../../../utils/apiFetch";
import CreateConstituency from "./CreateConstituency";
import ConstituencyManagement from "./ConstituencyManaging";

export default function ConstituenciesList({ election_id }) {
  const [constituencies, setConstituencies] = useState([]);
  const [showCreateConstituency, setShowCreateConstituency] = useState(false);
  const [selectedConstituency, setSelectedConstituency] = useState(null);
  const [loading, setLoading] = useState(true);
  const [constituencyManage, setConstituencyManage] = useState(false);

  const fetchConstituencies = async () => {
    try {
      setLoading(true);

      const res = await apiFetch(
        `/admins/elections/${election_id}/constituencies`,
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      setConstituencies(data.constituencies);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConstituencies();
  }, [election_id]);

  const handleDelete = async (constituency_id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this constituency?",
    );

    if (!confirmDelete) return;

    try {
      const res = await apiFetch(
        `/admins/elections/${election_id}/constituencies/${constituency_id}`,
        {
          method: "DELETE",
        },
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      setConstituencies((prev) =>
        prev.filter((c) => c.constituency_id !== constituency_id),
      );

      alert(data.message);
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) {
    return <div className="text-center py-10">Loading constituencies...</div>;
  }

  if (constituencyManage && selectedConstituency) {
    return (
      <ConstituencyManagement
        election_id={election_id}
        constituency_id={selectedConstituency.constituency_id}
        constituency={selectedConstituency}
        onBack={() => {
          setConstituencyManage(false);
          setSelectedConstituency(null);
        }}
      />
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-display text-xl font-bold text-ink">
          Constituencies
        </h2>

        {!showCreateConstituency && (
          <button
            onClick={() => setShowCreateConstituency(true)}
            className="btn !w-auto px-4 text-xs "
          >
            + Add Constituency
          </button>
        )}
      </div>

      {showCreateConstituency ? (
        <div className="animate-fade-in">
          <CreateConstituency
            onClose={() => setShowCreateConstituency(false)}
            election_id={election_id}
            onSuccess={fetchConstituencies}
          />
        </div>
      ) : constituencies.length === 0 ? (
        <div className="bg-surface-alt/40 border border-light border-dashed p-10 rounded-lg text-center animate-fade-in">
          <p className="text-xs font-medium text-muted">
            No constituencies found within this registry.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto border border-light rounded-lg bg-surface animate-fade-in">
          <table className="w-full border-collapse">
            <thead className="bg-surface-alt border-b border-light">
              <tr>
                <th className="text-left px-5 py-3 text-[10px] uppercase tracking-widest font-bold text-muted w-20">
                  S.No.
                </th>
                <th className="text-left px-5 py-3 text-[10px] uppercase tracking-widest font-bold text-muted">
                  Constituency Name
                </th>
                <th className="text-right px-6 py-3 text-[10px] uppercase tracking-widest font-bold text-muted w-32">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-light/60">
              {constituencies.map((constituency, index) => (
                <tr
                  key={constituency.constituency_id}
                  className="hover:bg-surface-alt/30 transition-colors group"
                >
                  <td className="px-5 py-3.5 text-xs font-mono text-muted">
                    {index + 1}
                  </td>
                  <td
                    className="px-5 py-3.5 text-xs font-semibold text-ink cursor-pointer hover:text-accent-gold hover:underline transition-colors"
                    onClick={() => {
                      setConstituencyManage(true);
                      setSelectedConstituency(constituency);
                    }}
                  >
                    {constituency.constituency_name}
                  </td>
                  <td className="px-6 py-3.5">
                    <div className="flex justify-end gap-4 items-center">
                      {/* View Details / Management Control */}
                      <button
                        onClick={() => {
                          setConstituencyManage(true);
                          setSelectedConstituency(constituency);
                        }}
                        className="text-muted hover:text-ink transition-all duration-200 hover:scale-110"
                        title="View Matrix Details"
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        onClick={() =>
                          handleDelete(constituency.constituency_id)
                        }
                        className="text-muted hover:text-accent transition-all duration-200 hover:scale-110"
                        title="Purge Record"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
