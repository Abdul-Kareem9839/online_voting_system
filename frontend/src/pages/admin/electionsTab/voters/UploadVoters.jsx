import { useState } from "react";
import { motion } from "framer-motion";
import { apiFetch } from "../../../../utils/apiFetch";

export default function UploadVoters({ election_id }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];

    if (selected && !selected.name.endsWith(".csv")) {
      return alert("Please upload a CSV file only");
    }

    setFile(selected);
    setResult(null);
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select a CSV file first");

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("csv_file", file);

      const res = await apiFetch(
        `/admins/elections/upload-voters/${election_id}`,
        {
          method: "POST",
          body: formData,
        },
      );

      const data = await res.json();
      console.log("upload data", data);

      if (!res.ok) throw new Error(data.message);

      setResult(data);
    } catch (err) {
      console.error(err);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadSample = () => {
    const sample = `voter_name,email,voter_id_number,constituency_name
Rahul Sharma,rahul@gmail.com,VID001,North Delhi
Priya Verma,priya@gmail.com,VID002,South Delhi
Amit Kumar,amit@gmail.com,VID003,North Delhi`;

    const blob = new Blob([sample], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sample_voters.csv";
    a.click();
  };

  return (
    <div className="min-h-[65vh] flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black px-6 rounded-xl">
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 backdrop-blur-lg p-8 rounded-2xl shadow-xl w-full max-w-md"
      >
        <h2 className="text-3xl font-bold text-white text-center mb-2">
          Upload Voters
        </h2>

        <p className="text-gray-400 text-sm text-center mb-6">
          Upload a CSV file with voter details for this election
        </p>
        <button
          onClick={handleDownloadSample}
          className="w-full mb-4 border border-white/20 text-white/70 hover:text-white py-2 rounded-lg text-sm hover:bg-white/5 transition"
        >
          Download Sample CSV Format
        </button>

        <div className="border-2 border-dashed border-white/20 rounded-xl p-6 text-center mb-4">
          <input
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="hidden"
            id="csv-upload"
          />
          <label htmlFor="csv-upload" className="cursor-pointer">
            <p className="text-white/60 text-sm mb-2">
              {file ? file.name : "Click to select CSV file"}
            </p>
            <span className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm transition">
              Browse File
            </span>
          </label>
        </div>

        <button
          onClick={handleUpload}
          disabled={!file || loading}
          className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Uploading..." : "Upload Voters"}
        </button>

        {result && (
          <div className="mt-4 space-y-2">
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
              <p className="text-green-400 text-sm">{result.message}</p>
            </div>

            {result.errors && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 max-h-40 overflow-y-auto">
                <p className="text-red-400 text-sm font-semibold mb-1">
                  Failed rows:
                </p>
                {result.errors.map((err, i) => (
                  <p key={i} className="text-red-300/70 text-xs">
                    {err.row.email} — {err.reason}
                  </p>
                ))}
              </div>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
}
