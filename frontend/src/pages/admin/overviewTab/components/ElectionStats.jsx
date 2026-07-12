import { TrendingUp, Calendar, CheckCircle2 } from "lucide-react";

export default function ElectionStats({ data }) {
  const electionStats = [
    {
      label: "Active",
      value: data?.stats?.activeElections ?? 0,
      bg: "#EEF3EB",
      textColor: "var(--sage)",
      icon: <TrendingUp className="h-4 w-4" />,
    },
    {
      label: "Upcoming",
      value: data?.stats?.upcomingElections ?? 0,
      bg: "#EAF0F8",
      textColor: "var(--ink)",
      icon: <Calendar className="h-4 w-4" />,
    },
    {
      label: "Completed",
      value: data?.stats?.completedElections ?? 0,
      bg: "var(--surface-alt)",
      textColor: "var(--muted)",
      icon: <CheckCircle2 className="h-4 w-4" />,
    },
  ];

  return (
    <>
      <div className="dashboard-card lg:col-span-2">
        <div className="section-divider">
          <h3 className="font-display text-lg">Election status</h3>
        </div>
        <div className="space-y-3">
          {electionStats.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 rounded"
              style={{ background: item.bg }}
            >
              <div
                className="flex items-center gap-2"
                style={{ color: item.textColor }}
              >
                {item.icon}
                <span className="font-body text-sm">{item.label}</span>
              </div>
              <span
                className="font-display text-xl"
                style={{ color: item.textColor }}
              >
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
