import { useState } from 'react';

const codeExamples = [
  {
    label: 'Basic Agent',
    icon: 'fa-robot',
    code: `import agentscope
from agentscope.agents import DialogAgent

# Initialize AgentScope with your model config
agentscope.init(
    model_configs=[{
        "model_type": "openai_chat",
        "config_name": "gpt-4",
        "model_name": "gpt-4",
        "api_key": "YOUR_API_KEY",
    }]
)

# Create a dialog agent
agent = DialogAgent(
    name="Assistant",
    sys_prompt="You are a helpful assistant.",
    model_config_name="gpt-4",
)

# Start a conversation
response = agent({"role": "user", "content": "Hello!"})
print(response.content)`,
  },
  {
    label: 'Multi-Agent',
    icon: 'fa-network-wired',
    code: `from agentscope.agents import DialogAgent
from agentscope.pipelines import sequential_pipeline

# Create multiple specialized agents
researcher = DialogAgent(
    name="Researcher",
    sys_prompt="You research and gather information.",
    model_config_name="gpt-4",
)

writer = DialogAgent(
    name="Writer",
    sys_prompt="You write clear, engaging content.",
    model_config_name="gpt-4",
)

reviewer = DialogAgent(
    name="Reviewer",
    sys_prompt="You review and improve content quality.",
    model_config_name="gpt-4",
)

# Run agents in a pipeline
result = sequential_pipeline(
    agents=[researcher, writer, reviewer],
    x={"role": "user", "content": "Write about AI trends"},
)`,
  },
  {
    label: 'Tool Use',
    icon: 'fa-tools',
    code: `from agentscope.agents import ReActAgent
from agentscope.service import (
    ServiceToolkit,
    web_search,
    execute_python_code,
)

# Define tools for the agent
toolkit = ServiceToolkit()
toolkit.add(web_search)
toolkit.add(execute_python_code)

# Create a ReAct agent with tools
agent = ReActAgent(
    name="ToolAgent",
    sys_prompt="You are an agent with web search and code execution capabilities.",
    model_config_name="gpt-4",
    service_toolkit=toolkit,
    max_iters=10,
)

# The agent will use tools to answer
response = agent({
    "role": "user",
    "content": "Search for the latest AI papers and summarize them",
})`,
  },
];

export const CodeDemoSection = () => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <section className="py-24 px-6" style={{ background: 'rgba(255,255,255,0.01)' }}>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm mb-6"
              style={{
                background: 'rgba(5, 150, 105, 0.1)',
                border: '1px solid rgba(5, 150, 105, 0.3)',
                color: '#34d399',
              }}
            >
              <i className="fas fa-code text-xs"></i>
              <span>Simple & Intuitive API</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Build agents in
              <br />
              <span className="gradient-text">minutes, not days</span>
            </h2>
            <p className="text-gray-400 text-lg mb-8 leading-relaxed">
              AgentScope&apos;s clean Python API lets you create sophisticated multi-agent systems
              with just a few lines of code. From simple chatbots to complex autonomous workflows.
            </p>

            <div className="space-y-4">
              {[
                { icon: 'fa-check-circle', color: '#34d399', text: 'Declarative agent configuration' },
                { icon: 'fa-check-circle', color: '#34d399', text: 'Built-in conversation management' },
                { icon: 'fa-check-circle', color: '#34d399', text: 'Flexible pipeline composition' },
                { icon: 'fa-check-circle', color: '#34d399', text: 'Async & parallel execution' },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-3">
                  <i className={`fas ${item.icon}`} style={{ color: item.color }}></i>
                  <span className="text-gray-300">{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex gap-2 mb-4">
              {codeExamples.map((example, index) => (
                <button
                  key={example.label}
                  onClick={() => setActiveTab(index)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                  style={{
                    background: activeTab === index ? 'rgba(22, 119, 255, 0.2)' : 'rgba(255,255,255,0.05)',
                    border: activeTab === index ? '1px solid rgba(22, 119, 255, 0.4)' : '1px solid rgba(255,255,255,0.08)',
                    color: activeTab === index ? '#60a5fa' : '#9ca3af',
                  }}
                >
                  <i className={`fas ${example.icon} text-xs`}></i>
                  {example.label}
                </button>
              ))}
            </div>

            <div className="code-block overflow-hidden">
              <div
                className="flex items-center gap-2 px-4 py-3"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}
              >
                <div className="w-3 h-3 rounded-full bg-red-500 opacity-70"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500 opacity-70"></div>
                <div className="w-3 h-3 rounded-full bg-green-500 opacity-70"></div>
                <span className="ml-2 text-gray-500 text-xs">example.py</span>
              </div>
              <pre
                className="p-5 overflow-x-auto text-sm leading-relaxed"
                style={{ color: '#e2e8f0', maxHeight: '400px' }}
              >
                <code
                  dangerouslySetInnerHTML={{
                    __html: codeExamples[activeTab].code
                      .replace(/import\s+(\w+)/g, '<span style="color:#c792ea">import</span> <span style="color:#82aaff">$1</span>')
                      .replace(/from\s+(\S+)\s+import/g, '<span style="color:#c792ea">from</span> <span style="color:#82aaff">$1</span> <span style="color:#c792ea">import</span>')
                      .replace(/(#.*)/g, '<span style="color:#546e7a">$1</span>')
                      .replace(/"([^"]*)"/g, '<span style="color:#c3e88d">"$1"</span>')
                      .replace(/\b(def|class|return|if|else|for|in|True|False|None)\b/g, '<span style="color:#c792ea">$1</span>'),
                  }}
                />
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
