import type { NextPage, GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

const blogPosts = [
  {
    slug: 'introducing-agentscope',
    title: 'Introducing AgentScope: A Multi-Agent Platform for Everyone',
    excerpt: 'Today we are excited to announce AgentScope, a new open-source framework for building multi-agent AI applications with ease and robustness.',
    date: '2024-01-15',
    readTime: '8 min read',
    category: 'Announcement',
    color: '#1677FF',
    author: { name: 'AgentScope Team', avatar: 'ASO' },
  },
  {
    slug: 'building-research-agents',
    title: 'Building Research Agents with AgentScope',
    excerpt: 'Learn how to create sophisticated research agents that can search the web, read papers, and synthesize information automatically.',
    date: '2024-01-22',
    readTime: '12 min read',
    category: 'Tutorial',
    color: '#7c3aed',
    author: { name: 'Dr. Sarah Chen', avatar: 'SC' },
  },
  {
    slug: 'multi-agent-patterns',
    title: 'Common Multi-Agent Design Patterns',
    excerpt: 'Explore the most effective patterns for designing multi-agent systems: pipeline, debate, reflection, and more.',
    date: '2024-02-01',
    readTime: '15 min read',
    category: 'Deep Dive',
    color: '#059669',
    author: { name: 'Alex Johnson', avatar: 'AJ' },
  },
  {
    slug: 'agentscope-v010',
    title: 'AgentScope v0.1.0 Release Notes',
    excerpt: 'What\'s new in AgentScope v0.1.0: improved model support, new built-in tools, performance improvements, and bug fixes.',
    date: '2024-02-10',
    readTime: '5 min read',
    category: 'Release',
    color: '#d97706',
    author: { name: 'AgentScope Team', avatar: 'AS' },
  },
  {
    slug: 'tool-use-best-practices',
    title: 'Best Practices for Tool Use in AI Agents',
    excerpt: 'A comprehensive guide to designing, implementing, and testing tools for your AI agents to maximize reliability and performance.',
    date: '2024-02-18',
    readTime: '10 min read',
    category: 'Best Practices',
    color: '#dc2626',
    author: { name: 'Maria Rodriguez', avatar: 'MR' },
  },
  {
    slug: 'scaling-multi-agent-systems',
    title: 'Scaling Multi-Agent Systems to Production',
    excerpt: 'Lessons learned from deploying multi-agent systems at scale: monitoring, fault tolerance, cost optimization, and more.',
    date: '2024-02-25',
    readTime: '18 min read',
    category: 'Production',
    color: '#0891b2',
    author: { name: 'James Liu', avatar: 'JL' },
  },
];

const categoryColors: Record<string, string> = {
  Announcement: '#1677FF',
  Tutorial: '#7c3aed',
  'Deep Dive': '#059669',
  Release: '#d97706',
  'Best Practices': '#dc2626',
  Production: '#0891b2',
};

interface BlogProps {
  buildTime: string;
}

const Blog: NextPage<BlogProps> = () => {
  const featuredPost = blogPosts[0];
  const remainingPosts = blogPosts.slice(1);

  return (
    <>
      <Head>
        <title>Blog - AgentScope</title>
        <meta name="description" content="AgentScope blog - tutorials, announcements, and deep dives" />
      </Head>

      <Navbar />

      <main className="min-h-screen pt-24 pb-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              <span className="gradient-text">Blog</span>
            </h1>
            <p className="text-gray-400 text-lg">
              Tutorials, announcements, and insights from the AgentScope team
            </p>
          </div>

          <div
            className="glass-card rounded-2xl p-8 mb-8 group hover:scale-[1.01] transition-all duration-300 cursor-pointer"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span
                    className="px-3 py-1 rounded-full text-xs font-semibold"
                    style={{
                      background: `${categoryColors[featuredPost.category]}15`,
                      color: categoryColors[featuredPost.category],
                      border: `1px solid ${categoryColors[featuredPost.category]}30`,
                    }}
                  >
                    {featuredPost.category}
                  </span>
                  <span className="text-gray-500 text-sm">Featured</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 group-hover:text-blue-400 transition-colors leading-tight">
                  {featuredPost.title}
                </h2>
                <p className="text-gray-400 leading-relaxed mb-6">{featuredPost.excerpt}</p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                      style={{ background: 'linear-gradient(135deg, #1677FF, #7c3aed)' }}
                    >
                      {featuredPost.author.avatar}
                    </div>
                    <span className="text-gray-400 text-sm">{featuredPost.author.name}</span>
                  </div>
                  <span className="text-gray-600 text-sm">{featuredPost.date}</span>
                  <span className="text-gray-600 text-sm">{featuredPost.readTime}</span>
                </div>
              </div>
              <div
                className="rounded-xl h-48 flex items-center justify-center"
                style={{
                  background: `linear-gradient(135deg, ${featuredPost.color}20, ${featuredPost.color}05)`,
                  border: `1px solid ${featuredPost.color}20`,
                }}
              >
                <i className="fas fa-newspaper text-6xl" style={{ color: `${featuredPost.color}60` }}></i>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {remainingPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="glass-card rounded-2xl p-6 group hover:scale-105 transition-all duration-300 block"
              >
                <div
                  className="rounded-xl h-32 flex items-center justify-center mb-4"
                  style={{
                    background: `linear-gradient(135deg, ${post.color}15, ${post.color}05)`,
                    border: `1px solid ${post.color}15`,
                  }}
                >
                  <i className="fas fa-file-alt text-3xl" style={{ color: `${post.color}60` }}></i>
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <span
                    className="px-2 py-1 rounded-md text-xs font-medium"
                    style={{
                      background: `${categoryColors[post.category]}10`,
                      color: categoryColors[post.category],
                    }}
                  >
                    {post.category}
                  </span>
                  <span className="text-gray-600 text-xs">{post.readTime}</span>
                </div>

                <h3 className="text-white font-semibold mb-2 group-hover:text-blue-400 transition-colors leading-snug">
                  {post.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-2">
                  {post.excerpt}
                </p>

                <div className="flex items-center gap-2">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
                    style={{ background: 'linear-gradient(135deg, #1677FF, #7c3aed)' }}
                  >
                    {post.author.avatar}
                  </div>
                  <span className="text-gray-500 text-xs">{post.author.name}</span>
                  <span className="text-gray-600 text-xs ml-auto">{post.date}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export const getStaticProps: GetStaticProps<BlogProps> = async () => {
  return {
    props: {
      buildTime: new Date().toISOString(),
    },
  };
};

export default Blog;
