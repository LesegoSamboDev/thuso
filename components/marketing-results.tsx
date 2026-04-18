'use client';

import { Target, DollarSign, TrendingUp, Video, Zap, Wrench, Users, MessageSquare, ChartBar as BarChart2 } from 'lucide-react';
import type { MarketingStrategy } from '@/types/marketing';

interface ResultSectionProps {
  icon: React.ReactNode;
  title: string;
  accent: string;
  children: React.ReactNode;
}

function ResultSection({ icon, title, accent, children }: ResultSectionProps) {
  return (
    <div className={`rounded-2xl glass-card p-6 border border-white/[0.07] hover:border-white/[0.12] transition-all duration-300`}>
      <div className="flex items-center gap-3 mb-5">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${accent}`}>
          {icon}
        </div>
        <h3 className="font-semibold text-white text-sm">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center px-3 py-1 rounded-lg bg-white/[0.05] border border-white/[0.08] text-xs text-slate-300 leading-relaxed">
      {children}
    </span>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2.5 text-sm text-slate-300 leading-relaxed">
          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-400/60 shrink-0" />
          {item}
        </li>
      ))}
    </ul>
  );
}

interface MarketingResultsProps {
  strategy: MarketingStrategy;
}

export function MarketingResults({ strategy }: MarketingResultsProps) {
  return (
    <div className="space-y-4">
      <ResultSection
        icon={<Target className="w-4 h-4 text-blue-400" />}
        title="Target Audience"
        accent="bg-blue-500/10 border border-blue-500/20"
      >
        <div className="space-y-4">
          <div>
            <p className="text-xs text-slate-500 font-medium mb-1.5">Demographics</p>
            <p className="text-sm text-slate-300 leading-relaxed">{strategy.targetAudience.demographics}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium mb-1.5">Psychographics</p>
            <p className="text-sm text-slate-300 leading-relaxed">{strategy.targetAudience.psychographics}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium mb-2">Pain Points</p>
            <div className="flex flex-wrap gap-2">
              {strategy.targetAudience.painPoints.map((point, i) => (
                <Pill key={i}>{point}</Pill>
              ))}
            </div>
          </div>
        </div>
      </ResultSection>

      <ResultSection
        icon={<BarChart2 className="w-4 h-4 text-emerald-400" />}
        title="Positioning Strategy"
        accent="bg-emerald-500/10 border border-emerald-500/20"
      >
        <div className="space-y-4">
          <div>
            <p className="text-xs text-slate-500 font-medium mb-1.5">Value Proposition</p>
            <p className="text-sm text-slate-300 leading-relaxed">{strategy.positioning.valueProposition}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium mb-1.5">Competitive Advantage</p>
            <p className="text-sm text-slate-300 leading-relaxed">{strategy.positioning.competitiveAdvantage}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium mb-1.5">Brand Voice</p>
            <p className="text-sm text-slate-300 leading-relaxed">{strategy.positioning.brandVoice}</p>
          </div>
        </div>
      </ResultSection>

      <ResultSection
        icon={<DollarSign className="w-4 h-4 text-amber-400" />}
        title="Pricing Strategy"
        accent="bg-amber-500/10 border border-amber-500/20"
      >
        <div className="space-y-4">
          <div className="flex items-start gap-3 p-3 rounded-xl bg-amber-500/5 border border-amber-500/10">
            <TrendingUp className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
            <p className="text-sm text-amber-200/80 leading-relaxed font-medium">{strategy.pricingFeedback.assessment}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium mb-1.5">Recommendation</p>
            <p className="text-sm text-slate-300 leading-relaxed">{strategy.pricingFeedback.recommendation}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium mb-1.5">Reasoning</p>
            <p className="text-sm text-slate-300 leading-relaxed">{strategy.pricingFeedback.reasoning}</p>
          </div>
        </div>
      </ResultSection>

      <ResultSection
        icon={<Video className="w-4 h-4 text-rose-400" />}
        title="Content Ideas"
        accent="bg-rose-500/10 border border-rose-500/20"
      >
        <div className="space-y-5">
          <div>
            <div className="flex items-center gap-2 mb-2.5">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">TikTok</span>
            </div>
            <BulletList items={strategy.contentIdeas.tiktok} />
          </div>
          <div className="h-px bg-white/5" />
          <div>
            <div className="flex items-center gap-2 mb-2.5">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Instagram</span>
            </div>
            <BulletList items={strategy.contentIdeas.instagram} />
          </div>
          <div className="h-px bg-white/5" />
          <div>
            <div className="flex items-center gap-2 mb-2.5">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Ads</span>
            </div>
            <BulletList items={strategy.contentIdeas.ads} />
          </div>
        </div>
      </ResultSection>

      <ResultSection
        icon={<Zap className="w-4 h-4 text-yellow-400" />}
        title="Hook Ideas"
        accent="bg-yellow-500/10 border border-yellow-500/20"
      >
        <div className="space-y-3">
          {strategy.hooks.map((hook, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <span className="text-xs text-slate-600 font-mono mt-0.5 w-4 shrink-0">{String(i + 1).padStart(2, '0')}</span>
              <p className="text-sm text-slate-200 leading-relaxed italic">&ldquo;{hook}&rdquo;</p>
            </div>
          ))}
        </div>
      </ResultSection>

      <ResultSection
        icon={<Wrench className="w-4 h-4 text-cyan-400" />}
        title="Product Improvements"
        accent="bg-cyan-500/10 border border-cyan-500/20"
      >
        <BulletList items={strategy.improvements} />
      </ResultSection>
    </div>
  );
}
