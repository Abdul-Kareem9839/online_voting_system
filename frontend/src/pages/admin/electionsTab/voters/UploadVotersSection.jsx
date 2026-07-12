import UploadVoters from "./UploadVoters";

export default function UploadVotersSection({ election_id, onClose }) {
  return (
    <>
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl font-semibold">Upload Voters</h2>
        <button
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Back to Voters
        </button>
      </div>

      <p className="text-gray-500 text-sm mb-6">
        Upload the eligible voters list for this election.
      </p>

      <UploadVoters election_id={election_id} />
    </>
  );
}
