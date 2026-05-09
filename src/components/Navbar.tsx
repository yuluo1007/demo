import { useState, useEffect } from 'react';
import Link from 'next/link';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Docs', href: '/docs' },
    { label: 'Tutorial', href: '/tutorial' },
    { label: 'API', href: '/api-reference' },
    { label: 'Gallery', href: '/gallery' },
    { label: 'Blog', href: '/blog' },
  ];

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: isScrolled ? 'rgba(10, 10, 15, 0.95)' : 'transparent',
        backdropFilter: isScrolled ? 'blur(20px)' : 'none',
        borderBottom: isScrolled ? '1px solid rgba(255,255,255,0.08)' : 'none',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm"
            style={{ background: 'linear-gradient(135deg, #1677FF, #7c3aed)' }}
          >
            AS
          </div>
          <span className="text-white font-semibold text-lg tracking-tight">AgentScope</span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-4 py-2 text-sm text-gray-400 hover:text-white rounded-lg transition-all duration-200 hover:bg-white/5"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <a
            href="https://github.com/modelscope/agentscope"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-400 hover:text-white rounded-lg transition-all duration-200 hover:bg-white/5"
          >
            <i className="fab fa-github text-base"></i>
            <span>GitHub</span>
          </a>
          <Link
            href="/docs"
            className="px-4 py-2 text-sm text-white rounded-lg font-medium transition-all duration-200 hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #1677FF, #7c3aed)' }}
          >
            Get Started
          </Link>
        </div>

        <button
          className="md:hidden text-gray-400 hover:text-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'} text-xl`}></i>
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden px-6 pb-4" style={{ background: 'rgba(10, 10, 15, 0.98)' }}>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="block py-3 text-gray-400 hover:text-white border-b border-white/5 transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/docs"
            className="block mt-4 py-3 text-center text-white rounded-lg font-medium"
            style={{ background: 'linear-gradient(135deg, #1677FF, #7c3aed)' }}
          >
            Get Started
          </Link>
        </div>
      )}
    </nav>
  );
};
