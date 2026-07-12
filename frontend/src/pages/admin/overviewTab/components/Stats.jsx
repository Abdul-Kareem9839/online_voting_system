import { Vote, MapPin, Users, UserCheck } from "lucide-react";

export default function Stats({ data }) {
  const stats = [
    {
      icon: <Vote className="h-5 w-5" />,
      title: "Total Elections",
      value: data?.stats?.totalElections ?? 0,
      description: "All elections created",
      accentClass: "text-ink",
      borderColor: "var(--ink)",
    },
    {
      icon: <MapPin className="h-5 w-5" />,
      title: "Constituencies",
      value: data?.stats?.totalConstituencies ?? 0,
      description: "Across all elections",
      accentClass: "text-success",
      borderColor: "var(--sage)",
    },
    {
      icon: <Users className="h-5 w-5" />,
      title: "Total Voters",
      value: data?.stats?.totalVoters ?? 0,
      description: "Pre-approved voters",
      accentClass: "text-success",
      borderColor: "var(--sage)",
    },
    {
      icon: <UserCheck className="h-5 w-5" />,
      title: "Registered Voters",
      value: data?.stats?.registeredVoters ?? 0,
      description: "Completed registration",
      accentClass: "text-accent",
      borderColor: "var(--red)",
    },
  ];

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="dashboard-card"
            style={{ borderLeft: `3px solid ${stat.borderColor}` }}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="font-body text-xs uppercase tracking-wide text-muted">
                  {stat.title}
                </p>
                <p className="font-display text-3xl mt-1">{stat.value}</p>
                <p className="font-body text-xs mt-1 text-muted">
                  {stat.description}
                </p>
              </div>
              <div className={stat.accentClass}>{stat.icon}</div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
