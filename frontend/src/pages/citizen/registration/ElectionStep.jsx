import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function ElectionStep({ data, updateData, next, back }) {
  const { pendingElections = [] } = data;

  const [selectedElection, setSelectedElection] = useState(null);

  useEffect(() => {
    if (pendingElections.length === 1) {
      setSelectedElection(pendingElections[0]);
    }
  }, [pendingElections]);

  const handleContinue = () => {
    if (!selectedElection) {
      return alert("Please select an election.");
    }

    updateData({
      voter_id: selectedElection.voter_id,
      election_id: selectedElection.election_id,
      election_name: selectedElection.election_name,
      face_registered: selectedElection.face_registered,
    });

    next();
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-6 font-body"
      style={{ background: "#EDEAE3" }}
    >
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl p-8"
        style={{
          background: "#FAF8F3",
          border: "1px solid #D8D4C8",
        }}
      >
        <span
          className="block text-center text-xs tracking-[0.2em] uppercase mb-2"
          style={{ color: "#9C2B2B" }}
        >
          Step 2 of 5
        </span>

        <h2
          className="font-display text-3xl text-center mb-6"
          style={{ color: "#1C2541" }}
        >
          Select Election
        </h2>

        {pendingElections.length === 1 ? (
          <div
            className="border rounded-lg p-5"
            style={{
              borderColor: "#D8D4C8",
              background: "#FDFCF8",
            }}
          >
            <h3
              className="text-xl font-semibold mb-2"
              style={{ color: "#1C2541" }}
            >
              {selectedElection?.election_name}
            </h3>

            <p className="text-sm" style={{ color: "#6B6A63" }}>
              This is the only pending election available for registration.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingElections.map((election) => (
              <label
                key={election.election_id}
                className={`flex items-start gap-3 p-4 border rounded-lg cursor-pointer transition ${
                  selectedElection?.election_id === election.election_id
                    ? "border-red-700"
                    : ""
                }`}
                style={{
                  borderColor:
                    selectedElection?.election_id === election.election_id
                      ? "#9C2B2B"
                      : "#D8D4C8",
                }}
              >
                <input
                  type="radio"
                  checked={
                    selectedElection?.election_id === election.election_id
                  }
                  onChange={() => setSelectedElection(election)}
                />

                <div>
                  <h3 className="font-semibold" style={{ color: "#1C2541" }}>
                    {election.election_name}
                  </h3>

                  {election.constituency_name && (
                    <p className="text-sm mt-1" style={{ color: "#6B6A63" }}>
                      Constituency: {election.constituency_name}
                    </p>
                  )}

                  {election.start_date && (
                    <p className="text-sm mt-1" style={{ color: "#6B6A63" }}>
                      Starts:{" "}
                      {new Date(election.start_date).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </label>
            ))}
          </div>
        )}

        <div className="flex justify-between mt-8 gap-4 text-xs">
          <button onClick={back} className="btn ">
            {"<< "}Back
          </button>

          <button onClick={handleContinue} className="btn">
            Continue{" >>"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
