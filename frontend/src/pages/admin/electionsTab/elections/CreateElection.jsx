import { motion } from "framer-motion";
import { useState } from "react";
import { API_URL } from "../../../../../config/api";
import { apiFetch } from "../../../../utils/apiFetch";

export default function CreateElection({ onClose }) {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [formData, setFormData] = useState({
    election_name: "",
    start_date: "",
    end_date: "",
    election_type: "",
  });

  const handleChange = (e) => {
    setErrorMsg("");
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreate = async () => {
    if (
      !formData.election_name ||
      !formData.start_date ||
      !formData.end_date ||
      !formData.election_type
    ) {
      setErrorMsg("Please! Fill all the fields.");
      return;
    }

    try {
      setLoading(true);
      setErrorMsg("");

      const payload = {
        election_name: formData.election_name,
        start_date: formData.start_date.replace("T", " ") + ":00",
        end_date: formData.end_date.replace("T", " ") + ":00",
        election_type: formData.election_type,
      };

      const res = await apiFetch(`/admins/elections/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error || "Election creation failed");
        return;
      }

      alert("Election created successfully");
      onClose();
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getLocalDateTime = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 px-4 py-6">
      <div
        className="absolute inset-0 transition-opacity"
        style={{
          backgroundColor: "rgba(21, 25, 31, 0.4)",
          backdropFilter: "blur(1px)",
        }}
        onClick={onClose}
      />

      <motion.div
        initial={{ y: 15, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative card max-w-2xl w-full bg-paper overflow-y-auto z-10 text-left p-6"
      >
        <h3 className="font-display text-xl font-bold text-ink mb-6 section-divider">
          Create New Election
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-muted mb-1.5">
              Election Name
            </label>
            <input
              onChange={handleChange}
              name="election_name"
              value={formData.election_name}
              type="text"
              className="inp"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-muted mb-1.5">
                Start Date & Time
              </label>
              <input
                onChange={handleChange}
                name="start_date"
                value={formData.start_date}
                type="datetime-local"
                min={getLocalDateTime()}
                className="inp"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-muted mb-1.5">
                End Date & Time
              </label>
              <input
                onChange={handleChange}
                name="end_date"
                value={formData.end_date}
                type="datetime-local"
                min={
                  formData.start_date || new Date().toISOString().slice(0, 16)
                }
                className="inp"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-muted mb-1.5">
              Election Type
            </label>
            <select
              onChange={handleChange}
              name="election_type"
              value={formData.election_type}
              className="inp appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22none%22%3E%3Cpath%20d%3D%22M7%209l3%203%203-3%22%20stroke%3D%22%231c2541%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem] bg-[right_0.75rem_center] bg-no-repeat pr-10"
              style={{ backgroundPosition: "right 12px center" }}
            >
              <option value="">Choose Election type</option>
              <option value="State Assembly">State Assembly</option>
              <option value="local">Local</option>
              <option value="Municipal Corporation">
                Municipal Corporation
              </option>
              <option value="University">University</option>
              <option value="Organization">Organization</option>
            </select>
          </div>

          {errorMsg && (
            <p className="text-accent text-xs font-semibold mt-1 mb-2 border p-2 w-1/2">
              {errorMsg}
            </p>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-xs font-medium border border-light text-ink rounded bg-surface-alt hover:bg-white transition-colors"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleCreate}
              disabled={loading}
              className="btn !w-auto px-6 !py-2.5 text-xs shadow-none"
            >
              {loading ? "Creating..." : "Create Election"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
