import { useState } from "react";
import { API_URL } from "../../../../../config/api";


export default function EditElection({ election, onClose }) {
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [formData, setFormData] = useState({
    election_name: election.election_name || "",
    election_type: election.election_type || "",
    start_date: election.start_date ? election.start_date.slice(0, 16) : "",
    end_date: election.end_date ? election.end_date.slice(0, 16) : "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setErrorMsg("");

      const payload = {
        election_name: formData.election_name,
        election_type: formData.election_type,
        start_date: formData.start_date.replace("T", " ") + ":00",
        end_date: formData.end_date.replace("T", " ") + ":00",
      };

      const res = await fetch(
        `${API_URL}/admins/elections/${election.election_id}`,
        {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Update failed");
      }

      alert("Election updated successfully");
      onClose();
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="paper-card p-6">
        <h1 className="font-display text-2xl font-bold mb-6 section-divider">
          Edit Election
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-muted mb-1.5">
              Election Name
            </label>
            <input
              type="text"
              name="election_name"
              value={formData.election_name}
              onChange={handleChange}
              className="inp"
              required
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-muted mb-1.5">
              Election Type
            </label>
            <select
              name="election_type"
              value={formData.election_type}
              onChange={handleChange}
              className="inp appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22none%22%3E%3Cpath%20d%3D%22M7%209l3%203%203-3%22%20stroke%3D%22%231c2541%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem] bg-[right_0.75rem_center] bg-no-repeat pr-10"
              style={{ backgroundPosition: "right 12px center" }}
              required
            >
              <option value="">Select Type</option>
              <option value="State Assembly">State Assembly</option>
              <option value="local">Local</option>
              <option value="Municipal Corporation">
                Municipal Corporation
              </option>
              <option value="University">University</option>
              <option value="Organization">Organization</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-muted mb-1.5">
                Start Date & Time
              </label>
              <input
                type="datetime-local"
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
                className="inp"
                required
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-muted mb-1.5">
                End Date & Time
              </label>
              <input
                type="datetime-local"
                name="end_date"
                value={formData.end_date}
                onChange={handleChange}
                className="inp"
                required
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4 mt-6">
            <button
              type="submit"
              disabled={saving}
              className="btn !w-auto px-6 !py-2.5 text-xs shadow-none"
            >
              {saving ? "Updating..." : "Update Election"}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-xs font-medium border border-light text-ink rounded bg-surface-alt hover:bg-white transition-colors"
            >
              Cancel
            </button>

            {errorMsg && (
              <p className="ms-auto text-accent text-xs font-semibold mb-4 border p-2 w-1/2">
                {errorMsg}
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}