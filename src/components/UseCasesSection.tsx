const useCases = [
  {
    icon: 'fa-search',
    color: '#1677FF',
    title: 'Research Assistant',
    description: 'Automate literature review, data collection, and report generation with coordinated research agents.',
    tags: ['Web Search', 'Summarization', 'Report Generation'],
  },
  {
    icon: 'fa-code',
    color: '#7c3aed',
    title: 'Code Generation',
    description: 'Multi-agent systems that plan, write, test, and review code collaboratively for complex software projects.',
    tags: ['Code Writing', 'Testing', 'Code Review'],
  },
  {
    icon: 'fa-comments',
    color: '#059669',
    title: 'Customer Support',
    description: 'Intelligent support systems with specialized agents for different domains, escalation, and resolution tracking.',
    tags: ['Intent Detection', 'Knowledge Base', 'Escalation'],
  },
  {
    icon: 'fa-chart-bar',
    color: '#d97706',
    title: 'Data Analysis',
    description: 'Automated data pipelines with agents that collect, clean, analyze, and visualize complex datasets.',
    tags: ['Data Collection', 'Analysis', 'Visualization'],
  },
  {
    icon: 'fa-graduation-cap',
    color: '#dc2626',
    title: 'Education & Tutoring',
    description: 'Personalized learning experiences with adaptive agents that assess, teach, and provide feedback.',
    tags: ['Assessment', 'Personalization', 'Feedback'],
  },
  {
    icon: 'fa-robot',
    color: '#0891b2',
    title: 'Autonomous Workflows',
    description: 'End-to-end automation of complex business processes with self-correcting, goal-oriented agent teams.',
    tags: ['Planning', 'Execution', 'Self-Correction'],
  },
];

export const UseCasesSection = () => {
  return (
    <section className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm mb-6"
            style={{
              background: 'rgba(217, 119, 6, 0.1)',
              border: '1px solid rgba(217, 119, 6, 0.3)',
              color: '#fbbf24',
            }}
          >
            <i className="fas fa-lightbulb text-xs"></i>
            <span>Use Cases</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            What can you build
            <br />
            <span className="gradient-text">with AgentScope?</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            From simple chatbots to complex autonomous systems, AgentScope powers
            a wide range of AI applications across industries.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {useCases.map((useCase) => (
            <div
              key={useCase.title}
              className="glass-card rounded-2xl p-6 group hover:scale-105 transition-all duration-300 cursor-default"
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110"
                style={{
                  background: `${useCase.color}15`,
                  border: `1px solid ${useCase.color}30`,
                }}
              >
                <i
                  className={`fas ${useCase.icon} text-lg`}
                  style={{ color: useCase.color }}
                ></i>
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">{useCase.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">{useCase.description}</p>
              <div className="flex flex-wrap gap-2">
                {useCase.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full text-xs font-medium"
                    style={{
                      background: `${useCase.color}10`,
                      border: `1px solid ${useCase.color}25`,
                      color: useCase.color,
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
