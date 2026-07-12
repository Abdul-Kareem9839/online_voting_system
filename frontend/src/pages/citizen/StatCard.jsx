const StatCard = ({
  icon,
  title,
  value,
  description,
  borderColor,
  accentClass,
}) => {
  return (
    <div
      className="dashboard-card"
      style={{ borderLeft: `3px solid ${borderColor || "var(--ink)"}` }}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="font-body text-xs uppercase tracking-wide text-muted">
            {title}
          </p>
          <p className="font-display text-3xl mt-1 text-ink">{value}</p>
          <p className="font-body text-xs mt-1 text-muted">{description}</p>
        </div>
        <div className={accentClass || "text-ink"}>{icon}</div>
      </div>
    </div>
  );
};

export default StatCard;
