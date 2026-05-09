import Link from 'next/link';

export const CTASection = () => {
  return (
    <section className="py-24 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <div
          className="rounded-3xl p-16 relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(22, 119, 255, 0.15), rgba(124, 58, 237, 0.15))',
            border: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse 60% 60% at 50% 50%, rgba(22, 119, 255, 0.1) 0%, transparent 70%)',
            }}
          />
          <div className="relative z-10">
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm mb-8"
              style={{
                background: 'rgba(22, 119, 255, 0.15)',
                border: '1px solid rgba(22, 119, 255, 0.3)',
                color: '#60a5fa',
              }}
            >
              <i className="fas fa-rocket text-xs"></i>
              <span>Start Building Today</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Ready to build your
              <br />
              <span className="gradient-text">first AI agent?</span>
            </h2>

            <p className="text-gray-400 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
              Join thousands of developers building the next generation of AI applications
              with AgentScope. It&apos;s free, open-source, and ready to use.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/docs"
                className="flex items-center gap-2 px-8 py-4 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105"
                style={{
                  background: 'linear-gradient(135deg, #1677FF, #7c3aed)',
                  boxShadow: '0 0 30px rgba(22, 119, 255, 0.4)',
                }}
              >
                <i className="fas fa-book-open"></i>
                Read the Docs
              </Link>
              <Link
                href="/tutorial"
                className="flex items-center gap-2 px-8 py-4 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)' }}
              >
                <i className="fas fa-play-circle"></i>
                Interactive Tutorial
              </Link>
            </div>

            <div className="mt-10 flex items-center justify-center gap-8 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <i className="fas fa-check text-green-400 text-xs"></i>
                <span>Free &amp; Open Source</span>
              </div>
              <div className="flex items-center gap-2">
                <i className="fas fa-check text-green-400 text-xs"></i>
                <span>No Credit Card Required</span>
              </div>
              <div className="flex items-center gap-2">
                <i className="fas fa-check text-green-400 text-xs"></i>
                <span>MIT License</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
