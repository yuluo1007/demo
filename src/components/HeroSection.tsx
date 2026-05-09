import Link from 'next/link';
import { useEffect, useRef } from 'react';

export const HeroSection = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: Array<{ x: number; y: number; vx: number; vy: number; size: number; opacity: number }> = [];

    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.5 + 0.1,
      });
    }

    let animationId: number;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(96, 165, 250, ${particle.opacity})`;
        ctx.fill();
      });

      particles.forEach((p1, i) => {
        particles.slice(i + 1).forEach((p2) => {
          const distance = Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
          if (distance < 120) {
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(96, 165, 250, ${0.08 * (1 - distance / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" style={{ opacity: 0.6 }} />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(22, 119, 255, 0.12) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm mb-8"
          style={{
            background: 'rgba(22, 119, 255, 0.1)',
            border: '1px solid rgba(22, 119, 255, 0.3)',
            color: '#60a5fa',
          }}
        >
          <i className="fas fa-star text-yellow-400 text-xs"></i>
          <span>Open Source · Multi-Agent Framework</span>
          <span
            className="px-2 py-0.5 rounded-full text-xs font-semibold"
            style={{ background: 'rgba(22, 119, 255, 0.2)', color: '#93c5fd' }}
          >
            v0.1.0
          </span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight tracking-tight">
          A Multi-Agent Platform
          <br />
          <span className="gradient-text">for Everyone</span>
        </h1>

        <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
          AgentScope is a cutting-edge multi-agent platform designed to empower developers
          to build LLM-empowered multi-agent applications with ease, robustness, and efficiency.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link
            href="/docs"
            className="flex items-center gap-2 px-8 py-4 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            style={{
              background: 'linear-gradient(135deg, #1677FF, #7c3aed)',
              boxShadow: '0 0 30px rgba(22, 119, 255, 0.3)',
            }}
          >
            <i className="fas fa-rocket"></i>
            Get Started
          </Link>
          <a
            href="https://github.com/modelscope/agentscope"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-8 py-4 text-white font-semibold rounded-xl transition-all duration-300 hover:scale-105"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)' }}
          >
            <i className="fab fa-github"></i>
            View on GitHub
          </a>
        </div>

        <div className="code-block p-6 text-left max-w-2xl mx-auto" style={{ fontSize: '14px' }}>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="ml-2 text-gray-500 text-xs">terminal</span>
          </div>
          <div className="space-y-2">
            <div>
              <span className="text-gray-500">$ </span>
              <span className="text-green-400">pip install agentscope</span>
            </div>
            <div>
              <span className="text-gray-500">$ </span>
              <span className="text-blue-400">python</span>
              <span className="text-gray-300"> -c </span>
              <span className="text-yellow-300">{'"import agentscope; print(agentscope.__version__)"'}</span>
            </div>
            <div className="text-gray-400">0.1.0</div>
          </div>
        </div>
      </div>

      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-600"
        style={{ animation: 'float 2s ease-in-out infinite' }}
      >
        <span className="text-xs uppercase tracking-widest">Scroll to explore</span>
        <i className="fas fa-chevron-down text-sm"></i>
      </div>
    </section>
  );
};
