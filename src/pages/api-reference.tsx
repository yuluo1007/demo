import type { NextPage, GetStaticProps } from 'next';
import Head from 'next/head';
import { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

const apiCategories = [
  {
    name: 'Agents',
    color: '#1677FF',
    icon: 'fa-robot',
    apis: [
      {
        name: 'DialogAgent',
        signature: 'DialogAgent(name, sys_prompt, model_config_name, **kwargs)',
        description: 'A conversational agent that maintains dialogue history and responds to messages.',
        params: [
          { name: 'name', type: 'str', description: 'The name of the agent' },
          { name: 'sys_prompt', type: 'str', description: 'System prompt defining agent behavior' },
          { name: 'model_config_name', type: 'str', description: 'Name of the model configuration to use' },
        ],
      },
      {
        name: 'ReActAgent',
        signature: 'ReActAgent(name, sys_prompt, model_config_name, service_toolkit, max_iters)',
        description: 'An agent that uses the ReAct (Reasoning + Acting) pattern with tool use.',
        params: [
          { name: 'name', type: 'str', description: 'The name of the agent' },
          { name: 'service_toolkit', type: 'ServiceToolkit', description: 'Toolkit containing available tools' },
          { name: 'max_iters', type: 'int', description: 'Maximum number of reasoning iterations' },
        ],
      },
    ],
  },
  {
    name: 'Pipelines',
    color: '#7c3aed',
    icon: 'fa-sitemap',
    apis: [
      {
        name: 'sequential_pipeline',
        signature: 'sequential_pipeline(agents, x)',
        description: 'Run agents sequentially, passing output of each agent as input to the next.',
        params: [
          { name: 'agents', type: 'List[AgentBase]', description: 'List of agents to run in sequence' },
          { name: 'x', type: 'Msg', description: 'Initial input message' },
        ],
      },
      {
        name: 'forloopPipeline',
        signature: 'forloopPipeline(agents, x, max_loop)',
        description: 'Run agents in a loop until a condition is met or max iterations reached.',
        params: [
          { name: 'agents', type: 'List[AgentBase]', description: 'List of agents to run in loop' },
          { name: 'max_loop', type: 'int', description: 'Maximum number of loop iterations' },
        ],
      },
    ],
  },
  {
    name: 'Services',
    color: '#059669',
    icon: 'fa-tools',
    apis: [
      {
        name: 'web_search',
        signature: 'web_search(query, num_results)',
        description: 'Search the web and return relevant results.',
        params: [
          { name: 'query', type: 'str', description: 'Search query string' },
          { name: 'num_results', type: 'int', description: 'Number of results to return (default: 10)' },
        ],
      },
      {
        name: 'execute_python_code',
        signature: 'execute_python_code(code, timeout)',
        description: 'Execute Python code in a sandboxed environment.',
        params: [
          { name: 'code', type: 'str', description: 'Python code to execute' },
          { name: 'timeout', type: 'int', description: 'Execution timeout in seconds (default: 30)' },
        ],
      },
    ],
  },
];

interface ApiReferenceProps {
  buildTime: string;
}

const ApiReference: NextPage<ApiReferenceProps> = () => {
  const [activeCategory, setActiveCategory] = useState(apiCategories[0].name);
  const [expandedApi, setExpandedApi] = useState<string | null>(null);

  const currentCategory = apiCategories.find((cat) => cat.name === activeCategory);

  return (
    <>
      <Head>
        <title>API Reference - AgentScope</title>
        <meta name="description" content="Complete AgentScope API reference documentation" />
      </Head>

      <Navbar />

      <main className="min-h-screen pt-24 pb-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              <span className="gradient-text">API Reference</span>
            </h1>
            <p className="text-gray-400 text-lg">
              Complete reference for all AgentScope classes, functions, and utilities
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <div className="glass-card rounded-2xl p-4 sticky top-24">
                <h3 className="text-gray-400 text-xs uppercase tracking-wider mb-4 px-2">Categories</h3>
                <nav className="space-y-1">
                  {apiCategories.map((category) => (
                    <button
                      key={category.name}
                      onClick={() => setActiveCategory(category.name)}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 text-left"
                      style={{
                        background: activeCategory === category.name ? `${category.color}15` : 'transparent',
                        color: activeCategory === category.name ? category.color : '#9ca3af',
                        border: activeCategory === category.name ? `1px solid ${category.color}30` : '1px solid transparent',
                      }}
                    >
                      <i className={`fas ${category.icon} text-xs`}></i>
                      {category.name}
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            <div className="lg:col-span-3 space-y-4">
              {currentCategory && (
                <>
                  <div className="flex items-center gap-3 mb-6">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{
                        background: `${currentCategory.color}15`,
                        border: `1px solid ${currentCategory.color}30`,
                      }}
                    >
                      <i className={`fas ${currentCategory.icon}`} style={{ color: currentCategory.color }}></i>
                    </div>
                    <h2 className="text-white font-semibold text-2xl">{currentCategory.name}</h2>
                  </div>

                  {currentCategory.apis.map((api) => (
                    <div
                      key={api.name}
                      className="glass-card rounded-2xl overflow-hidden"
                    >
                      <button
                        className="w-full p-6 text-left"
                        onClick={() => setExpandedApi(expandedApi === api.name ? null : api.name)}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="text-white font-semibold text-lg mb-1">{api.name}</h3>
                            <code
                              className="text-xs px-3 py-1.5 rounded-lg"
                              style={{
                                background: 'rgba(255,255,255,0.05)',
                                color: '#93c5fd',
                                fontFamily: 'monospace',
                              }}
                            >
                              {api.signature}
                            </code>
                          </div>
                          <i
                            className={`fas fa-chevron-${expandedApi === api.name ? 'up' : 'down'} text-gray-500 text-sm mt-1 ml-4 flex-shrink-0`}
                          ></i>
                        </div>
                        <p className="text-gray-400 text-sm mt-3 leading-relaxed">{api.description}</p>
                      </button>

                      {expandedApi === api.name && (
                        <div
                          className="px-6 pb-6"
                          style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
                        >
                          <h4 className="text-white text-sm font-semibold mt-4 mb-3">Parameters</h4>
                          <div className="space-y-3">
                            {api.params.map((param) => (
                              <div
                                key={param.name}
                                className="flex items-start gap-4 p-3 rounded-xl"
                                style={{ background: 'rgba(255,255,255,0.03)' }}
                              >
                                <code
                                  className="text-sm font-mono flex-shrink-0"
                                  style={{ color: currentCategory.color }}
                                >
                                  {param.name}
                                </code>
                                <span
                                  className="text-xs px-2 py-0.5 rounded-md flex-shrink-0 mt-0.5"
                                  style={{
                                    background: 'rgba(255,255,255,0.06)',
                                    color: '#9ca3af',
                                    fontFamily: 'monospace',
                                  }}
                                >
                                  {param.type}
                                </span>
                                <span className="text-gray-400 text-sm">{param.description}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export const getStaticProps: GetStaticProps<ApiReferenceProps> = async () => {
  return {
    props: {
      buildTime: new Date().toISOString(),
    },
  };
};

export default ApiReference;
