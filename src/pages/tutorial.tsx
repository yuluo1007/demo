import type { NextPage, GetStaticProps } from 'next';
import Head from 'next/head';
import { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

const tutorials = [
  {
    id: 1,
    title: 'Hello, AgentScope!',
    description: 'Your first agent in 5 minutes. Learn the basics of creating and running an agent.',
    duration: '5 min',
    difficulty: 'Beginner',
    color: '#1677FF',
    icon: 'fa-hand-wave',
    steps: [
      'Install AgentScope',
      'Configure your first model',
      'Create a simple dialog agent',
      'Run a conversation',
    ],
  },
  {
    id: 2,
    title: 'Multi-Agent Conversation',
    description: 'Create a debate between two agents with different perspectives on a topic.',
    duration: '15 min',
    difficulty: 'Beginner',
    color: '#7c3aed',
    icon: 'fa-comments',
    steps: [
      'Create two agents with different personas',
      'Set up a conversation pipeline',
      'Implement turn-taking logic',
      'Add a moderator agent',
    ],
  },
  {
    id: 3,
    title: 'Web Search Agent',
    description: 'Build an agent that can search the web and synthesize information from multiple sources.',
    duration: '20 min',
    difficulty: 'Intermediate',
    color: '#059669',
    icon: 'fa-globe',
    steps: [
      'Set up web search tool',
      'Create a ReAct agent',
      'Implement search and summarize loop',
      'Handle multiple sources',
    ],
  },
  {
    id: 4,
    title: 'Code Generation Pipeline',
    description: 'Build a multi-agent system that plans, writes, tests, and reviews code.',
    duration: '30 min',
    difficulty: 'Intermediate',
    color: '#d97706',
    icon: 'fa-code',
    steps: [
      'Create a planner agent',
      'Build a code writer agent',
      'Add a test runner agent',
      'Implement a reviewer agent',
    ],
  },
  {
    id: 5,
    title: 'Custom Tool Development',
    description: 'Learn to build and integrate custom tools for your agents.',
    duration: '25 min',
    difficulty: 'Intermediate',
    color: '#dc2626',
    icon: 'fa-wrench',
    steps: [
      'Define tool interface',
      'Implement tool logic',
      'Register with ServiceToolkit',
      'Test with a ReAct agent',
    ],
  },
  {
    id: 6,
    title: 'Production Deployment',
    description: 'Deploy your multi-agent system to production with monitoring and fault tolerance.',
    duration: '45 min',
    difficulty: 'Advanced',
    color: '#0891b2',
    icon: 'fa-server',
    steps: [
      'Set up distributed execution',
      'Configure monitoring',
      'Implement retry logic',
      'Deploy with Docker',
    ],
  },
];

const difficultyColors: Record<string, string> = {
  Beginner: '#059669',
  Intermediate: '#d97706',
  Advanced: '#dc2626',
};

interface TutorialProps {
  buildTime: string;
}

const Tutorial: NextPage<TutorialProps> = () => {
  const [activeTutorial, setActiveTutorial] = useState<number | null>(null);

  return (
    <>
      <Head>
        <title>Tutorial - AgentScope</title>
        <meta name="description" content="Interactive AgentScope tutorials for all skill levels" />
      </Head>

      <Navbar />

      <main className="min-h-screen pt-24 pb-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm mb-6"
              style={{
                background: 'rgba(5, 150, 105, 0.1)',
                border: '1px solid rgba(5, 150, 105, 0.3)',
                color: '#34d399',
              }}
            >
              <i className="fas fa-graduation-cap text-xs"></i>
              <span>Interactive Tutorials</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Learn by <span className="gradient-text">Building</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Step-by-step tutorials that take you from zero to building production-ready
              multi-agent systems. Each tutorial includes runnable code examples.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tutorials.map((tutorial) => (
              <div
                key={tutorial.id}
                className="glass-card rounded-2xl overflow-hidden group cursor-pointer transition-all duration-300 hover:scale-105"
                onClick={() => setActiveTutorial(activeTutorial === tutorial.id ? null : tutorial.id)}
              >
                <div
                  className="p-6"
                  style={{
                    background: `linear-gradient(135deg, ${tutorial.color}10, transparent)`,
                    borderBottom: activeTutorial === tutorial.id ? `1px solid ${tutorial.color}20` : 'none',
                  }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                      style={{
                        background: `${tutorial.color}15`,
                        border: `1px solid ${tutorial.color}30`,
                      }}
                    >
                      <i className={`fas ${tutorial.icon} text-lg`} style={{ color: tutorial.color }}></i>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className="px-2 py-1 rounded-md text-xs font-medium"
                        style={{
                          background: `${difficultyColors[tutorial.difficulty]}15`,
                          color: difficultyColors[tutorial.difficulty],
                        }}
                      >
                        {tutorial.difficulty}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-white font-semibold text-lg mb-2 group-hover:text-blue-400 transition-colors">
                    {tutorial.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-4">{tutorial.description}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-gray-500 text-sm">
                      <i className="fas fa-clock text-xs"></i>
                      <span>{tutorial.duration}</span>
                    </div>
                    <i
                      className={`fas fa-chevron-${activeTutorial === tutorial.id ? 'up' : 'down'} text-gray-500 text-xs transition-transform duration-200`}
                    ></i>
                  </div>
                </div>

                {activeTutorial === tutorial.id && (
                  <div className="p-6">
                    <h4 className="text-white text-sm font-semibold mb-3">What you&apos;ll learn:</h4>
                    <ol className="space-y-2">
                      {tutorial.steps.map((step, index) => (
                        <li key={step} className="flex items-center gap-3 text-sm text-gray-400">
                          <span
                            className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                            style={{
                              background: `${tutorial.color}20`,
                              color: tutorial.color,
                            }}
                          >
                            {index + 1}
                          </span>
                          {step}
                        </li>
                      ))}
                    </ol>
                    <button
                      className="mt-6 w-full py-3 rounded-xl text-white font-medium text-sm transition-all duration-200 hover:opacity-90"
                      style={{ background: `linear-gradient(135deg, ${tutorial.color}, ${tutorial.color}99)` }}
                    >
                      <i className="fas fa-play mr-2"></i>
                      Start Tutorial
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export const getStaticProps: GetStaticProps<TutorialProps> = async () => {
  return {
    props: {
      buildTime: new Date().toISOString(),
    },
  };
};

export default Tutorial;
