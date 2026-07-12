export default function Sidebar({ tabs, activeTab, setActiveTab }) {
  return (
    <aside className="lg:col-span-1 lg:pr-2 lg:border-r border-gray-300">
      <p className="text-xs uppercase tracking-[0.18em] text-accent mb-6">
        Navigation
      </p>

      <nav className="space-y-1">
        {tabs.map((tab) => {
          const active = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all rounded-lg font-body ${
                active
                  ? "bg-surface-alt text-ink border-l-[3px] border-ink"
                  : "text-muted hover:bg-surface-alt hover:text-ink"
              }`}
            >
              <tab.icon
                className={`h-5 w-5 flex-shrink-0 ${
                  active ? "text-ink" : "text-muted"
                }`}
              />

              <span className="text-sm font-medium">{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
