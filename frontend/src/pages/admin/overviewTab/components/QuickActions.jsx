import { Vote, CheckCircle2, UserCheck } from "lucide-react";

export default function QuickAction({ onTabChange }) {
  const quickActions = [
    {
      tab: "elections",
      icon: <Vote className="h-5 w-5" />,
      title: "Manage elections",
      desc: "Create or manage elections",
      className: "quick-action navy-action",
      iconColor: "var(--ink)",
    },
    {
      tab: "results",
      icon: <CheckCircle2 className="h-5 w-5" />,
      title: "View results",
      desc: "Declare and view results",
      className: "quick-action sage-action",
      iconColor: "var(--sage)",
    },
    {
      tab: "profile",
      icon: <UserCheck className="h-5 w-5" />,
      title: "Admin profile",
      desc: "View and edit your profile",
      className: "quick-action red-action",
      iconColor: "var(--red)",
    },
  ];

  return (
    <>
      <div className="dashboard-card lg:col-span-3">
        <div className="section-divider">
          <h3 className="font-display text-lg">Quick actions</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={() => onTabChange(action.tab)}
              className={action.className}
            >
              <div style={{ color: action.iconColor }}>{action.icon}</div>
              <h4 className="font-body font-medium text-sm mt-3 text-ink">
                {action.title}
              </h4>
              <p className="font-body text-xs mt-1 text-muted">{action.desc}</p>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
