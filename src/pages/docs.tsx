import type { NextPage, GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

const docSections = [
  {
    category: 'Getting Started',
    icon: 'fa-rocket',
    color: '#1677FF',
    items: [
      { title: 'Introduction', description: 'What is AgentScope and why use it?' },
      { title: 'Installation', description: 'Install AgentScope via pip or from source' },
      { title: 'Quick Start', description: 'Build your first agent in 5 minutes' },
      { title: 'Configuration', description: 'Configure models and environment settings' },
    ],
  },
  {
    category: 'Core Concepts',
    icon: 'fa-brain',
    color: '#7c3aed',
    items: [
      { title: 'Agents', description: 'Understanding agent types and behaviors' },
      { title: 'Messages', description: 'Message format and communication protocol' },
      { title: 'Pipelines', description: 'Orchestrating multi-agent workflows' },
      { title: 'Memory', description: 'Agent memory and context management' },
    ],
  },
  {
    category: 'Model Integration',
    icon: 'fa-plug',
    color: '#059669',
    items: [
      { title: 'OpenAI', description: 'GPT-4, GPT-3.5 and other OpenAI models' },
      { title: 'Anthropic', description: 'Claude 3 and Claude 2 integration' },
      { title: 'Local Models', description: 'Ollama, LM Studio, and local LLMs' },
      { title: 'Custom Models', description: 'Integrate any LLM with custom adapters' },
    ],
  },
  {
    category: 'Tools & Services',
    icon: 'fa-tools',
    color: '#d97706',
    items: [
      { title: 'Web Search', description: 'Search the web with Bing, Google, DuckDuckGo' },
      { title: 'Code Execution', description: 'Execute Python code in sandboxed environments' },
      { title: 'File Operations', description: 'Read, write, and manage files' },
      { title: 'Custom Tools', description: 'Build and register your own tools' },
    ],
  },
];

interface DocsProps {
  buildTime: string;
}

const Docs: NextPage<DocsProps> = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSections = docSections.map((section) => ({
    ...section,
    items: section.items.filter(
      (item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter((section) => section.items.length > 0);

  return (
    <>
      <Head>
        <title>Documentation - AgentScope</title>
        <meta name="description" content="AgentScope documentation and guides" />
      </Head>

      <Navbar />

      <main className="min-h-screen pt-24 pb-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              <span className="gradient-text">Documentation</span>
            </h1>
            <p className="text-gray-400 text-lg mb-8">
              Everything you need to build with AgentScope
            </p>

            <div className="max-w-xl mx-auto relative">
              <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"></i>
              <input
                type="text"
                placeholder="Search documentation..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl text-white placeholder-gray-500 outline-none focus:ring-2 focus:ring-blue-500/50"
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredSections.map((section) => (
              <div
                key={section.category}
                className="glass-card rounded-2xl p-6"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{
                      background: `${section.color}15`,
                      border: `1px solid ${section.color}30`,
                    }}
                  >
                    <i className={`fas ${section.icon}`} style={{ color: section.color }}></i>
                  </div>
                  <h2 className="text-white font-semibold text-lg">{section.category}</h2>
                </div>

                <div className="space-y-3">
                  {section.items.map((item) => (
                    <Link
                      key={item.title}
                      href={`/docs/${item.title.toLowerCase().replace(/\s+/g, '-')}`}
                      className="flex items-start gap-3 p-3 rounded-xl transition-all duration-200 group"
                      style={{ background: 'rgba(255,255,255,0.02)' }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)';
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.02)';
                      }}
                    >
                      <i
                        className="fas fa-file-alt mt-0.5 text-sm"
                        style={{ color: section.color }}
                      ></i>
                      <div>
                        <div className="text-white text-sm font-medium group-hover:text-blue-400 transition-colors">
                          {item.title}
                        </div>
                        <div className="text-gray-500 text-xs mt-0.5">{item.description}</div>
                      </div>
                      <i className="fas fa-arrow-right ml-auto text-gray-600 group-hover:text-blue-400 transition-colors text-xs mt-1"></i>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div
            className="mt-12 rounded-2xl p-8 text-center"
            style={{
              background: 'linear-gradient(135deg, rgba(22, 119, 255, 0.08), rgba(124, 58, 237, 0.08))',
              border: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <i className="fas fa-question-circle text-3xl text-blue-400 mb-4 block"></i>
            <h3 className="text-white font-semibold text-xl mb-2">Need help?</h3>
            <p className="text-gray-400 mb-6">
              Can&apos;t find what you&apos;re looking for? Join our community or open an issue on GitHub.
            </p>
            <div className="flex items-center justify-center gap-4">
              <a
                href="https://github.com/modelscope/agentscope/issues"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 text-white rounded-xl font-medium transition-all duration-200 hover:scale-105"
                style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}
              >
                <i className="fab fa-github"></i>
                Open Issue
              </a>
              <a
                href="#"
                className="flex items-center gap-2 px-6 py-3 text-white rounded-xl font-medium transition-all duration-200 hover:scale-105"
                style={{ background: 'linear-gradient(135deg, #1677FF, #7c3aed)' }}
              >
                <i className="fab fa-discord"></i>
                Join Discord
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export const getStaticProps: GetStaticProps<DocsProps> = async () => {
  return {
    props: {
      buildTime: new Date().toISOString(),
    },
  };
};

export default Docs;
