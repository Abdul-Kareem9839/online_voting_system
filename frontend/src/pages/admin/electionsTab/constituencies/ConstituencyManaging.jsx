import { useState } from "react";
import { Users, PlusCircle, Pencil, ArrowLeft } from "lucide-react";
import CandidatesList from "../candidates/CandidatesList";

export default function ConstituencyManagement({
  election_id,
  constituency_id,
  constituency,
  onBack,
}) {
  const [showCandidates, setShowCandidates] = useState(false);

  if (showCandidates) {
    return (
      <CandidatesList
        election_id={election_id}
        constituency_id={constituency_id}
        onBack={() => setShowCandidates(false)}
      />
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button onClick={onBack} className="p-2 rounded-lg hover:bg-gray-100">
          <ArrowLeft />
        </button>
        <div>
          <h1 className="text-3xl font-bold">
            {constituency?.constituency_name}
          </h1>
          <p className="text-gray-500 mt-1">
            Manage constituency and candidates
          </p>
        </div>
      </div>

      {/* Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
        <div
          onClick={() => setShowCandidates(true)}
          className="cursor-pointer border rounded-xl p-6 hover:shadow-lg transition"
        >
          <Users size={35} />
          <h2 className="text-lg font-semibold mt-4">Candidates</h2>
          <p className="text-gray-500 text-sm mt-2">View all candidates</p>
        </div>

        <div
          onClick={() => setShowCandidates(true)}
          className="cursor-pointer border rounded-xl p-6 hover:shadow-lg transition"
        >
          <PlusCircle size={35} />
          <h2 className="text-lg font-semibold mt-4">Add Candidate</h2>
          <p className="text-gray-500 text-sm mt-2">Register a new candidate</p>
        </div>

        <div className="cursor-pointer border rounded-xl p-6 hover:shadow-lg transition opacity-50">
          <Pencil size={35} />
          <h2 className="text-lg font-semibold mt-4">Edit Constituency</h2>
          <p className="text-gray-500 text-sm mt-2">
            Update constituency details
          </p>
        </div>
      </div>
    </div>
  );
}
