const VoteDistribution = ({ candidates, getPercentage }) => (
  <div className="space-y-4">
    {candidates.map((candidate) => {
      const pct = getPercentage(candidate.totalVotes);

      return (
        <div key={candidate.candidate_id}>
          <div className="flex justify-between items-center mb-1 text-sm">
            <span>{candidate.candidate_name}</span>
            <span>{pct}%</span>
          </div>

          <div className="w-full h-2 bg-gray-200 rounded overflow-hidden">
            <div
              className="h-full bg-red-800 transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      );
    })}
  </div>
);

export default VoteDistribution;
