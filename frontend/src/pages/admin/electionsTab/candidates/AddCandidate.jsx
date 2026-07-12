import { useState } from "react";
import { API_URL } from "../../../../../config/api";

export default function AddCandidate({
  election_id,
  constituency_id,
  onSuccess,
  onBack,
}) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    candidate_name: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.candidate_name.trim()) {
      return alert("Candidate name is required");
    }

    try {
      setLoading(true);

      const res = await fetch(
        `${API_URL}/admins/elections/${election_id}/constituencies/${constituency_id}/candidates/create`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            candidate_name: formData.candidate_name.trim(),
          }),
        },
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      alert("Candidate added successfully");
      await onSuccess();
      onBack();
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-card max-w-3xl mx-auto">
      <div className="section-divider">
        <h2 className="font-display text-2xl text-ink">Add Candidate</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 mt-4">
        <div>
          <label className="block mb-1.5 font-body text-xs uppercase tracking-wide text-muted">
            Candidate Name
          </label>
          <input
            type="text"
            name="candidate_name"
            value={formData.candidate_name}
            onChange={handleChange}
            required
            className="w-full font-body text-sm bg-paper border border-gray-300 rounded px-4 py-2 text-ink focus:outline-none focus:border-ink transition-colors"
            placeholder="Enter full name"
          />
        </div>

        <div>
          <label className="block mb-1.5 font-body text-xs uppercase tracking-wide text-muted">
            Candidate Photo
          </label>
          <input
            type="file"
            name="candidate_photo"
            accept="image/*"
            className="w-full font-body text-xs bg-surface-alt border border-gray-300 border-dashed rounded px-4 py-3 text-muted file:mr-4 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-medium file:bg-ink file:text-paper file:cursor-pointer hover:file:bg-neutral-800 transition-colors"
          />
        </div>

        {/* Form Actions */}
        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="bg-ink text-paper font-body text-xs font-medium px-5 py-2.5 rounded transition-colors hover:bg-neutral-800 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? "Adding..." : "Add Candidate"}
          </button>

          <button
            type="button"
            onClick={onBack}
            className="border border-gray-300 text-ink font-body text-xs font-medium px-5 py-2.5 rounded transition-colors hover:bg-surface-alt"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
