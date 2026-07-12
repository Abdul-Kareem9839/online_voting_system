import ElectionCard from "./ElectionCard";

const ElectionsList = ({ elections, onView, onDeclare, loading }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {elections.map((election) => (
        <ElectionCard
          key={election.election_id}
          election={election}
          onView={onView}
          onDeclare={onDeclare}
        />
      ))}
    </div>
  );
};

export default ElectionsList;
