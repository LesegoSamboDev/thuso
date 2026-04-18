'use client';

import Link from 'next/link';
import { ArrowRight, Zap, Target, TrendingUp, Sparkles, ChevronRight } from 'lucide-react';

const features = [
  {
    icon: Target,
    title: 'Target Audience',
    description: 'Pinpoint exactly who your ideal buyers are with precision demographic analysis.',
  },
  {
    icon: TrendingUp,
    title: 'Pricing Strategy',
    description: 'Get data-driven pricing recommendations tailored to your market.',
  },
  {
    icon: Zap,
    title: 'Content Ideas',
    description: 'Receive ready-to-use hooks, scripts, and ad copy for every platform.',
  },
  {
    icon: Sparkles,
    title: 'Growth Plan',
    description: 'A full marketing roadmap from day one to scale.',
  },
];

const badges = ['TikTok Ads', 'Instagram', 'Google Ads', 'Pricing', 'Positioning', 'Hooks'];

export default function LandingPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#060a14]">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="animate-orb absolute -top-40 -left-40 w-[700px] h-[700px] rounded-full opacity-20"
          style={{
            background: 'radial-gradient(circle, rgba(59,130,246,0.6) 0%, transparent 70%)',
          }}
        />
        <div
          className="animate-orb-delay absolute -bottom-60 -right-40 w-[600px] h-[600px] rounded-full opacity-15"
          style={{
            background: 'radial-gradient(circle, rgba(99,102,241,0.5) 0%, transparent 70%)',
          }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1px] opacity-20"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(59,130,246,0.8), transparent)' }}
        />
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.04) 1px, transparent 0)`,
          backgroundSize: '48px 48px',
        }} />
      </div>

      <nav className="relative z-10 flex items-center justify-between px-6 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold text-white text-lg tracking-tight">MarketMind</span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <span className="text-sm text-slate-400 hover:text-white transition-colors cursor-pointer">How it works</span>
          <span className="text-sm text-slate-400 hover:text-white transition-colors cursor-pointer">Features</span>
          <span className="text-sm text-slate-400 hover:text-white transition-colors cursor-pointer">Pricing</span>
        </div>
        <Link
          href="/analyze"
          className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg glass-card text-sm text-slate-300 hover:text-white transition-all hover:border-white/20"
        >
          Get started <ChevronRight className="w-3 h-3" />
        </Link>
      </nav>

      <section className="relative z-10 flex flex-col items-center text-center px-6 pt-20 pb-16 max-w-5xl mx-auto">
        <div className="animate-slide-up stagger-1 mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-xs text-blue-400 font-medium tracking-wide uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
          AI-Powered Marketing Intelligence
        </div>

        <h1 className="animate-slide-up stagger-2 text-5xl md:text-7xl font-bold tracking-tight text-white leading-[1.05] text-balance mb-6">
          Turn Your Product Into
          <br />
          <span className="gradient-text-blue">a Selling Machine</span>
        </h1>

        <p className="animate-slide-up stagger-3 text-lg md:text-xl text-slate-400 max-w-2xl leading-relaxed mb-10 text-balance">
          Upload your product and get AI-powered marketing strategies in seconds.
          Target audiences, pricing, content ideas — all tailored to your market.
        </p>

        <div className="animate-slide-up stagger-4 flex flex-col sm:flex-row items-center gap-4 mb-16">
          <Link
            href="/analyze"
            className="group flex items-center gap-2 px-8 py-4 rounded-2xl bg-blue-500 hover:bg-blue-400 text-white font-semibold text-base transition-all duration-200 glow-blue hover:glow-blue shadow-lg"
          >
            Start Analysis
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <span className="text-sm text-slate-500">No signup required</span>
        </div>

        <div className="animate-slide-up stagger-5 flex flex-wrap justify-center gap-2 mb-4">
          {badges.map((badge) => (
            <span
              key={badge}
              className="px-3 py-1 rounded-full glass-card text-xs text-slate-400 font-medium"
            >
              {badge}
            </span>
          ))}
        </div>
      </section>

      <section className="relative z-10 px-6 pb-24 max-w-6xl mx-auto">
        <div className="animate-slide-up stagger-3 glass-card-strong rounded-3xl p-8 md:p-12 glow-blue-sm mb-16">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
            <div>
              <p className="text-xs text-blue-400 font-medium uppercase tracking-widest mb-2">Live Preview</p>
              <h2 className="text-2xl font-bold text-white">Marketing Strategy Output</h2>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs text-emerald-400 font-medium">Ready in seconds</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: 'Target Audience', value: 'Urban professionals, 25–38, health-conscious', color: 'blue' },
              { label: 'Pricing Insight', value: 'Position at premium tier — $49 hits the sweet spot', color: 'emerald' },
              { label: 'Top Hook', value: '"The only tool you need to 10x your sales this week"', color: 'amber' },
            ].map((item) => (
              <div key={item.label} className="glass-card rounded-2xl p-5">
                <p className="text-xs text-slate-500 font-medium mb-2">{item.label}</p>
                <p className="text-sm text-slate-200 leading-relaxed">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className={`animate-slide-up stagger-${i + 2} glass-card rounded-2xl p-6 hover:border-white/15 transition-all duration-300 group`}
              >
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-4 group-hover:bg-blue-500/20 transition-colors">
                  <Icon className="w-5 h-5 text-blue-400" />
                </div>
                <h3 className="text-sm font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="relative z-10 px-6 pb-32 max-w-3xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 text-balance">
          Ready to outmarket your competition?
        </h2>
        <p className="text-slate-400 mb-8">
          Drop your product details and get a full strategy in under 30 seconds.
        </p>
        <Link
          href="/analyze"
          className="group inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white text-[#060a14] font-semibold text-base hover:bg-slate-100 transition-all duration-200"
        >
          Start Analysis — It&apos;s Free
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </section>

      <footer className="relative z-10 border-t border-white/5 px-6 py-8 max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-blue-500 flex items-center justify-center">
            <Sparkles className="w-3 h-3 text-white" />
          </div>
          <span className="text-sm font-medium text-slate-400">MarketMind</span>
        </div>
        <p className="text-xs text-slate-600">Powered by OpenAI GPT-4o</p>
      </footer>
    </main>
  );
}
