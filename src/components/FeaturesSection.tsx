const features = [
  {
    icon: 'fa-network-wired',
    color: '#1677FF',
    title: 'Multi-Agent Orchestration',
    description:
      'Seamlessly coordinate multiple AI agents to tackle complex tasks. Define agent roles, communication patterns, and workflows with intuitive APIs.',
  },
  {
    icon: 'fa-plug',
    color: '#7c3aed',
    title: 'Rich Model Support',
    description:
      'Integrate with OpenAI, Anthropic, Gemini, Llama, and 100+ LLM providers. Switch models without changing your agent logic.',
  },
  {
    icon: 'fa-tools',
    color: '#059669',
    title: 'Powerful Tool Ecosystem',
    description:
      'Equip agents with web search, code execution, file operations, and custom tools. Build domain-specific capabilities effortlessly.',
  },
  {
    icon: 'fa-shield-alt',
    color: '#d97706',
    title: 'Fault Tolerance & Retry',
    description:
      'Built-in error handling, automatic retries, and graceful degradation ensure your multi-agent systems run reliably in production.',
  },
  {
    icon: 'fa-chart-line',
    color: '#dc2626',
    title: 'Monitoring & Observability',
    description:
      'Real-time dashboards, message tracing, and performance metrics give you full visibility into your agent workflows.',
  },
  {
    icon: 'fa-code',
    color: '#0891b2',
    title: 'Developer-First Design',
    description:
      'Clean Python APIs, comprehensive documentation, and interactive tutorials make it easy to go from prototype to production.',
  },
];

export const FeaturesSection = () => {
  return (
    <section id="features" className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm mb-6"
            style={{
              background: 'rgba(124, 58, 237, 0.1)',
              border: '1px solid rgba(124, 58, 237, 0.3)',
              color: '#a78bfa',
            }}
          >
            <i className="fas fa-sparkles text-xs"></i>
            <span>Core Features</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Everything you need to build
            <br />
            <span className="gradient-text">powerful AI agents</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            AgentScope provides a comprehensive toolkit for building, deploying, and managing
            multi-agent AI systems at any scale.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="glass-card rounded-2xl p-6 group hover:scale-105 transition-all duration-300 cursor-default"
              style={{
                animationDelay: `${index * 0.1}s`,
                borderColor: 'rgba(255,255,255,0.08)',
              }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110"
                style={{
                  background: `${feature.color}20`,
                  border: `1px solid ${feature.color}40`,
                }}
              >
                <i
                  className={`fas ${feature.icon} text-lg`}
                  style={{ color: feature.color }}
                ></i>
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">{feature.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
