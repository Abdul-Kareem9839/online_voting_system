import { Calendar, MapPin } from "lucide-react";

const UpcomingElectionCard = ({ election }) => (
  <div
    className="dashboard-card"
    style={{ borderLeft: "3px solid var(--ink)" }}
  >
    <h3 className="font-display text-lg text-ink">{election.election_name}</h3>

    <div className="mt-3 font-body text-xs text-muted space-y-2">
      <div className="flex items-center gap-1.5">
        <Calendar className="w-4 h-4" />
        <span>
          Starts: {new Date(election.start_date).toLocaleDateString()}
        </span>
      </div>
      <div className="flex items-center gap-1.5">
        <MapPin className="w-4 h-4" />{" "}
        <span>{election.constituency?.constituency_name}</span>
      </div>
    </div>

    <div
      className="mt-5 font-body text-xs font-medium text-center rounded p-3"
      style={{
        background: "var(--surface-alt)",
        color: "var(--muted)",
      }}
    >
      Voting Not Started
    </div>
  </div>
);

export default UpcomingElectionCard;
