import { useState } from "react";
import { API_URL } from "../../../../../config/api";

export default function CreateConstituency({
  onClose,
  election_id,
  onSuccess,
}) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    constituency_name: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await fetch(
        `${API_URL}/admins/elections/${election_id}/constituencies/create`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...formData,
            election_id,
          }),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      alert("Constituency created successfully!");
      await onSuccess();
      onClose();
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-transparent py-6 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="card bg-surface border-light shadow-md overflow-hidden">
          <div className="p-6 border-b border-light/60 bg-surface-alt/40">
            <h1 className="font-display text-lg font-bold text-ink">
              Create Constituency
            </h1>
            <p className="text-xs text-muted font-medium mt-1">
              Add a new constituency segment partition to this election matrix
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div>
              <label className="block text-[10px] uppercase tracking-wider font-bold text-muted mb-2">
                Constituency Name
              </label>

              <input
                type="text"
                name="constituency_name"
                value={formData.constituency_name}
                onChange={handleChange}
                placeholder="Enter constituency name (e.g., New Delhi)"
                required
                className="inp"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-light/40">
              <button
                type="button"
                onClick={() => onClose()}
                className="px-4 py-2 text-xs border border-light rounded-md text-ink hover:bg-light/10 transition-colors"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="btn !w-auto px-5 py-2 text-xs"
              >
                {loading ? "Creating Cluster..." : "Create Constituency"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
