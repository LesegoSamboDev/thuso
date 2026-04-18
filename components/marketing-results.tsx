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
    <div className="rounded-2xl glass-card border border-slate-200 p-6 transition-all duration-300 hover:border-slate-300 dark:border-white/[0.07] dark:hover:border-white/[0.12]">
      <div className="flex items-center gap-3 mb-5">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${accent}`}>
          {icon}
        </div>
        <h3 className="font-semibold text-sm text-slate-900 dark:text-white">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-lg border border-slate-200 bg-slate-100 px-3 py-1 text-xs leading-relaxed text-slate-700 dark:border-white/[0.08] dark:bg-white/[0.05] dark:text-slate-300">
      {children}
    </span>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2.5 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
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
            <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">{strategy.targetAudience.demographics}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium mb-1.5">Psychographics</p>
            <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">{strategy.targetAudience.psychographics}</p>
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
            <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">{strategy.positioning.valueProposition}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium mb-1.5">Competitive Advantage</p>
            <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">{strategy.positioning.competitiveAdvantage}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium mb-1.5">Brand Voice</p>
            <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">{strategy.positioning.brandVoice}</p>
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
            <p className="text-sm font-medium leading-relaxed text-amber-950 dark:text-amber-200/80">{strategy.pricingFeedback.assessment}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium mb-1.5">Recommendation</p>
            <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">{strategy.pricingFeedback.recommendation}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 font-medium mb-1.5">Reasoning</p>
            <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">{strategy.pricingFeedback.reasoning}</p>
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
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">TikTok</span>
            </div>
            <BulletList items={strategy.contentIdeas.tiktok} />
          </div>
          <div className="h-px bg-slate-200 dark:bg-white/5" />
          <div>
            <div className="flex items-center gap-2 mb-2.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">Instagram</span>
            </div>
            <BulletList items={strategy.contentIdeas.instagram} />
          </div>
          <div className="h-px bg-slate-200 dark:bg-white/5" />
          <div>
            <div className="flex items-center gap-2 mb-2.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400">Ads</span>
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
            <div key={i} className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-white/[0.06] dark:bg-white/[0.03]">
              <span className="mt-0.5 w-4 shrink-0 font-mono text-xs text-slate-500 dark:text-slate-600">{String(i + 1).padStart(2, '0')}</span>
              <p className="text-sm italic leading-relaxed text-slate-800 dark:text-slate-200">&ldquo;{hook}&rdquo;</p>
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
