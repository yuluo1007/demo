import Link from 'next/link';

export const Footer = () => {
  const footerLinks = {
    Product: [
      { label: 'Features', href: '/#features' },
      { label: 'Gallery', href: '/gallery' },
      { label: 'Changelog', href: '/blog' },
    ],
    Resources: [
      { label: 'Documentation', href: '/docs' },
      { label: 'Tutorial', href: '/tutorial' },
      { label: 'API Reference', href: '/api-reference' },
    ],
    Community: [
      { label: 'GitHub', href: 'https://github.com/modelscope/agentscope', external: true },
      { label: 'Discord', href: '#', external: false },
      { label: 'Twitter', href: '#', external: false },
    ],
  };

  return (
    <footer className="border-t" style={{ borderColor: 'rgba(255,255,255,0.08)', background: '#050508' }}>
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm"
                style={{ background: 'linear-gradient(135deg, #1677FF, #7c3aed)' }}
              >
                AS
              </div>
              <span className="text-white font-semibold text-lg">AgentScope</span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              A Multi-Agent Platform for Everyone. Build, deploy, and manage AI agents with ease.
            </p>
            <div className="flex items-center gap-4">
              <a
                href="https://github.com/modelscope/agentscope"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-white transition-colors"
              >
                <i className="fab fa-github text-xl"></i>
              </a>
              <a href="#" className="text-gray-500 hover:text-white transition-colors">
                <i className="fab fa-twitter text-xl"></i>
              </a>
              <a href="#" className="text-gray-500 hover:text-white transition-colors">
                <i className="fab fa-discord text-xl"></i>
              </a>
            </div>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">{category}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    {(link as any).external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-500 hover:text-gray-300 text-sm transition-colors"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link href={link.href} className="text-gray-500 hover:text-gray-300 text-sm transition-colors">
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div
          className="mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4"
          style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
        >
          <p className="text-gray-600 text-sm">© 2024 AgentScope. All rights reserved.</p>
          <p className="text-gray-600 text-sm">
            Built with <i className="fas fa-heart text-red-500 mx-1"></i> by ModelScope Team
          </p>
        </div>
      </div>
    </footer>
  );
};
