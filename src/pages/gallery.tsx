import type { NextPage, GetStaticProps } from 'next';
import Head from 'next/head';
import { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

const galleryItems = [
  {
    title: 'AutoResearch',
    description: 'Automated research assistant that searches, reads, and synthesizes academic papers.',
    tags: ['Research', 'Web Search', 'Summarization'],
    stars: 342,
    color: '#1677FF',
    icon: 'fa-microscope',
    author: 'AgentScope Team',
  },
  {
    title: 'CodeReviewer',
    description: 'Multi-agent code review system with specialized agents for security, performance, and style.',
    tags: ['Code Review', 'Security', 'Multi-Agent'],
    stars: 289,
    color: '#7c3aed',
    icon: 'fa-code-branch',
    author: 'Community',
  },
  {
    title: 'DataAnalyst',
    description: 'Autonomous data analysis pipeline that generates insights and visualizations from raw data.',
    tags: ['Data Analysis', 'Visualization', 'Automation'],
    stars: 456,
    color: '#059669',
    icon: 'fa-chart-pie',
    author: 'AgentScope Team',
  },
  {
    title: 'CustomerBot',
    description: 'Intelligent customer support system with intent detection and knowledge base integration.',
    tags: ['Customer Support', 'NLP', 'Knowledge Base'],
    stars: 178,
    color: '#d97706',
    icon: 'fa-headset',
    author: 'Community',
  },
  {
    title: 'ContentCreator',
    description: 'AI content creation pipeline with research, writing, editing, and SEO optimization agents.',
    tags: ['Content', 'Writing', 'SEO'],
    stars: 234,
    color: '#dc2626',
    icon: 'fa-pen-fancy',
    author: 'Community',
  },
  {
    title: 'TradingAgent',
    description: 'Experimental trading agent that analyzes market data and generates trading signals.',
    tags: ['Finance', 'Analysis', 'Experimental'],
    stars: 567,
    color: '#0891b2',
    icon: 'fa-chart-line',
    author: 'Community',
  },
  {
    title: 'GameMaster',
    description: 'Interactive storytelling and game master agent for tabletop RPG experiences.',
    tags: ['Gaming', 'Storytelling', 'Interactive'],
    stars: 123,
    color: '#7c3aed',
    icon: 'fa-dice-d20',
    author: 'Community',
  },
  {
    title: 'MedicalAssist',
    description: 'Medical information assistant with symptom analysis and treatment recommendation agents.',
    tags: ['Healthcare', 'Analysis', 'Information'],
    stars: 198,
    color: '#dc2626',
    icon: 'fa-heartbeat',
    author: 'Research',
  },
  {
    title: 'LegalEagle',
    description: 'Legal document analysis and contract review system with specialized legal agents.',
    tags: ['Legal', 'Document Analysis', 'Review'],
    stars: 145,
    color: '#d97706',
    icon: 'fa-balance-scale',
    author: 'Community',
  },
];

const allTags = ['All', ...Array.from(new Set(galleryItems.flatMap((item) => item.tags)))];

interface GalleryProps {
  buildTime: string;
}

const Gallery: NextPage<GalleryProps> = () => {
  const [activeTag, setActiveTag] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = galleryItems.filter((item) => {
    const matchesTag = activeTag === 'All' || item.tags.includes(activeTag);
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTag && matchesSearch;
  });

  return (
    <>
      <Head>
        <title>Gallery - AgentScope</title>
        <meta name="description" content="Explore AgentScope agent examples and community projects" />
      </Head>

      <Navbar />

      <main className="min-h-screen pt-24 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm mb-6"
              style={{
                background: 'rgba(22, 119, 255, 0.1)',
                border: '1px solid rgba(22, 119, 255, 0.3)',
                color: '#60a5fa',
              }}
            >
              <i className="fas fa-th-large text-xs"></i>
              <span>Community Gallery</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Explore <span className="gradient-text">Agent Examples</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Discover what the community has built with AgentScope. From research tools
              to creative applications, find inspiration for your next project.
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"></i>
              <input
                type="text"
                placeholder="Search projects..."
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

          <div className="flex flex-wrap gap-2 mb-8">
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setActiveTag(tag)}
                className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-200"
                style={{
                  background: activeTag === tag ? 'rgba(22, 119, 255, 0.2)' : 'rgba(255,255,255,0.05)',
                  border: activeTag === tag ? '1px solid rgba(22, 119, 255, 0.4)' : '1px solid rgba(255,255,255,0.08)',
                  color: activeTag === tag ? '#60a5fa' : '#9ca3af',
                }}
              >
                {tag}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <div
                key={item.title}
                className="glass-card rounded-2xl p-6 group hover:scale-105 transition-all duration-300 cursor-pointer"
              >
                <div className="flex items-start justify-between mb-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                    style={{
                      background: `${item.color}15`,
                      border: `1px solid ${item.color}30`,
                    }}
                  >
                    <i className={`fas ${item.icon} text-lg`} style={{ color: item.color }}></i>
                  </div>
                  <div className="flex items-center gap-1 text-gray-500 text-sm">
                    <i className="fas fa-star text-yellow-400 text-xs"></i>
                    <span>{item.stars}</span>
                  </div>
                </div>

                <h3 className="text-white font-semibold text-lg mb-2 group-hover:text-blue-400 transition-colors">
                  {item.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-4">{item.description}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {item.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 rounded-md text-xs"
                      style={{
                        background: `${item.color}10`,
                        color: item.color,
                        border: `1px solid ${item.color}20`,
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div
                  className="flex items-center justify-between pt-4"
                  style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
                >
                  <span className="text-gray-500 text-xs">by {item.author}</span>
                  <button
                    className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    <span>View Project</span>
                    <i className="fas fa-arrow-right text-xs"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-16">
              <i className="fas fa-search text-4xl text-gray-600 mb-4 block"></i>
              <p className="text-gray-500">No projects found matching your criteria.</p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
};

export const getStaticProps: GetStaticProps<GalleryProps> = async () => {
  return {
    props: {
      buildTime: new Date().toISOString(),
    },
  };
};

export default Gallery;
