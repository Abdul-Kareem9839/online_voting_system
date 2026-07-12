import { Edit3, Trash2, Eye } from "lucide-react";
import { API_URL } from "../../../../../config/api";

export default function ManageElections({
  election,
  onView,
  onEdit,
  onDeleteSuccess,
}) {
  // 1. Calculate if the edit button should be deactivated
  const now = new Date();
  const endDate = new Date(election.end_date);

  const isDeactivated =
    election.status?.toLowerCase() === "completed" ||
    (isNaN(endDate.getTime()) ? false : now > endDate);

  const handleDelete = async () => {
    const confirmDelete = window.confirm(`Delete ${election.election_name} ?`);
    if (!confirmDelete) return;

    try {
      const res = await fetch(
        `${API_URL}/admins/elections/${election.election_id}`,
        { method: "DELETE", credentials: "include" },
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Delete failed");

      alert("Election deleted successfully");
      if (onDeleteSuccess) onDeleteSuccess(election.election_id);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="flex space-x-2 items-center">
      <button
        onClick={onView}
        className="btn-secondary !w-auto flex-1 !py-1.5 px-3 text-xs rounded transition-opacity flex items-center justify-center space-x-1"
      >
        <Eye className="h-3.5 w-3.5" />
        <span>View</span>
      </button>

      {/* 2. Deactivated state handles conditional classes, disabled attribute, and blocks clicks */}
      <button
        onClick={!isDeactivated ? onEdit : undefined}
        disabled={isDeactivated}
        className={`p-1.5 rounded transition-colors shrink-0 ${
          isDeactivated
            ? "text-muted opacity-50 cursor-not-allowed"
            : "text-ink hover:bg-surface-alt"
        }`}
        title={
          isDeactivated
            ? "Cannot edit a completed or ended election"
            : "Edit Entry"
        }
      >
        <Edit3 className="h-4 w-4" />
      </button>

      <button
        onClick={handleDelete}
        className="p-1.5 text-muted hover:text-accent hover:bg-surface-alt rounded transition-colors shrink-0"
        title="Delete Entry"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}
