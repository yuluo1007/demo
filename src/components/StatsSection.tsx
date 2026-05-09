const stats = [
  { value: '5K+', label: 'GitHub Stars', icon: 'fa-star', color: '#facc15' },
  { value: '100+', label: 'LLM Providers', icon: 'fa-brain', color: '#60a5fa' },
  { value: '50+', label: 'Built-in Tools', icon: 'fa-tools', color: '#34d399' },
  { value: '10K+', label: 'Active Users', icon: 'fa-users', color: '#a78bfa' },
];

export const StatsSection = () => {
  return (
    <section className="py-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div
          className="rounded-3xl p-12"
          style={{
            background: 'linear-gradient(135deg, rgba(22, 119, 255, 0.08), rgba(124, 58, 237, 0.08))',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center group">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-transform duration-300 group-hover:scale-110"
                  style={{
                    background: `${stat.color}15`,
                    border: `1px solid ${stat.color}30`,
                  }}
                >
                  <i className={`fas ${stat.icon} text-xl`} style={{ color: stat.color }}></i>
                </div>
                <div className="text-4xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-gray-400 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
