'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Zap, Target, TrendingUp, Sparkles, ChevronRight, Globe } from 'lucide-react';

const LANGUAGES = [
  { code: 'en', label: 'English', native: 'English', flag: '🇬🇧' },
  { code: 'zu', label: 'Zulu', native: 'isiZulu', flag: '🇿🇦' },
  { code: 'tn', label: 'Tswana', native: 'Setswana', flag: '🇧🇼' },
] as const;

type LangCode = (typeof LANGUAGES)[number]['code'];


function LanguageModal({ onSelect }: { onSelect: (code: LangCode) => void }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
      <div className="w-full max-w-sm rounded-2xl bg-[#0d1526] border border-white/10 p-8 shadow-2xl">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center mb-4">
            <Globe className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-xl font-bold text-white mb-1 text-center">Choose your language</h2>
          <p className="text-sm text-slate-400 text-center">Select the language you'd like to continue in.</p>
        </div>
        <div className="flex flex-col gap-3">
          {LANGUAGES.map((l) => (
            <button
              key={l.code}
              onClick={() => onSelect(l.code)}
              className="flex items-center gap-4 w-full px-5 py-4 rounded-xl bg-white/5 border border-white/8 hover:bg-blue-500/10 hover:border-blue-500/40 transition-all duration-200 group"
            >
              <span className="text-2xl">{l.flag}</span>
              <div className="flex flex-col items-start">
                <span className="text-sm font-semibold text-white group-hover:text-blue-300 transition-colors">{l.label}</span>
                <span className="text-xs text-slate-500">{l.native}</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-blue-400 ml-auto transition-colors" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

const translations: Record<LangCode, {
  nav: string[];
  heroTag: string;
  title: string;
  titleAccent: string;
  subtitle: string;
  cta: string;
  noSignup: string;
  badges: string[];
  livePreviewLabel: string;
  previewTitle: string;
  readyText: string;
  previewCards: { label: string; value: string }[];
  features: { title: string; description: string }[];
  ctaBottom: string;
  ctaBottomSub: string;
  ctaBottomBtn: string;
  footerPowered: string;
}> = {
  en: {
    nav: ['How it works', 'Features', 'Pricing'],
    heroTag: 'AI-Powered Marketing Intelligence',
    title: 'Turn Your Product Into',
    titleAccent: 'a Selling Machine',
    subtitle:
      'Upload your product and get AI-powered marketing strategies in seconds. Target audiences, pricing, content ideas — all tailored to your market.',
    cta: 'Start Analysis',
    noSignup: 'No signup required',
    badges: ['TikTok Ads', 'Instagram', 'Google Ads', 'Pricing', 'Positioning', 'Hooks'],
    livePreviewLabel: 'Live Preview',
    previewTitle: 'Marketing Strategy Output',
    readyText: 'Ready in seconds',
    previewCards: [
      { label: 'Target Audience', value: 'Urban professionals, 25–38, health-conscious' },
      { label: 'Pricing Insight', value: 'Position at premium tier — R49 hits the sweet spot' },
      { label: 'Top Hook', value: '"The only tool you need to 10x your sales this week"' },
    ],
    features: [
      { title: 'Target Audience', description: 'Pinpoint exactly who your ideal buyers are with precision demographic analysis.' },
      { title: 'Pricing Strategy', description: 'Get data-driven pricing recommendations tailored to your market.' },
      { title: 'Content Ideas', description: 'Receive ready-to-use hooks, scripts, and ad copy for every platform.' },
      { title: 'Growth Plan', description: 'A full marketing roadmap from day one to scale.' },
    ],
    ctaBottom: 'Ready to outmarket your competition?',
    ctaBottomSub: 'Drop your product details and get a full strategy in under 30 seconds.',
    ctaBottomBtn: "Start Analysis — It's Free",
    footerPowered: 'Powered by OpenAI GPT-4o',
  },

  zu: {
    nav: ['Isebenza kanjani', 'Izici', 'Intengo'],
    heroTag: 'Ubuhlakani be-AI beMakethe',
    title: 'Guqula Umkhiqizo Wakho',
    titleAccent: 'ube Umshini Wokuthengisa',
    subtitle:
      'Layisha umkhiqizo wakho uthole amasu okumaketha e-AI ngemizuzwana. Izethameli, intengo, nemiqondo yokuqukethwe — konke okulungelwe imakethe yakho.',
    cta: 'Qala Ukuhlaziya',
    noSignup: 'Akudingeki ukubhalisa',
    badges: ['Izikhangiso ze-TikTok', 'I-Instagram', 'Izikhangiso ze-Google', 'Intengo', 'Ukubeka', 'Ama-Hooks'],
    livePreviewLabel: 'Iboniswa Bukhoma',
    previewTitle: 'Imiphumela Yamasu Okumaketha',
    readyText: 'Ilungile ngemizuzwana',
    previewCards: [
      { label: 'Izethameli Ezihlosiwe', value: 'Abasebenzi bedolobha, 25–38, abanakekela impilo' },
      { label: 'Ulwazi Lwentengo', value: 'Beka enqophamhlaba ephezulu — R49 ithinta indawo elungile' },
      { label: 'I-Hook Ephezulu', value: '"Ithuluzi kuphela edingekayo ukwandisa ukuthengisa kwakho ngayi-10x"' },
    ],
    features: [
      { title: 'Izethameli Ezihlosiwe', description: 'Thola kahle ukuthi obani abathengi bakho abafanele ngokuhlaziya izidingo zabantu.' },
      { title: 'Isu Lentengo', description: 'Thola izincomo zentengo eziqhutshwa yi-data ezilungelwe imakethe yakho.' },
      { title: 'Imibono Yokuqukethwe', description: 'Thola ama-hooks, imibhalo, nezikhangiso ezisilungele ukusetshenziswa kuzo zonke izinkundla.' },
      { title: 'Uhlelo Lokukhula', description: 'Umgwaqo ogcwele wokumaketha kusukela ngosuku lokuqala uze ukukhula.' },
    ],
    ctaBottom: 'Ulungele ukudlula izinkampani eziphikisana nawe?',
    ctaBottomSub: 'Faka imininingwane yomkhiqizo wakho uthole isu eligcwele ngaphansi kwemizuzwana engama-30.',
    ctaBottomBtn: 'Qala Ukuhlaziya — Kufree',
    footerPowered: 'Ikunikezwe yi-OpenAI GPT-4o',
  },

  tn: {
    nav: ['Go bereka jang', 'Dintlha', 'Tlhwatlhwa'],
    heroTag: 'Botlhale jwa AI jwa Papatso',
    title: 'Fetola Seela sa Gago',
    titleAccent: 'go nna Motšhine wa go Rekisa',
    subtitle:
      'Tsenya seela sa gago mme o bone mekgwa ya papatso ya AI ka metsotswana. Batheetse, ditlhwatlhwa, le megopolo ya dikagiso — tsotlhe di dirilwe go tshwanela le mmaraka wa gago.',
    cta: 'Simolola Tshekatsheko',
    noSignup: 'Ga go a tlhokega go ikwadisa',
    badges: ['Dipapatso tsa TikTok', 'Instagram', 'Dipapatso tsa Google', 'Tlhwatlhwa', 'Kago', 'Dihuka'],
    livePreviewLabel: 'Ponalo e Bukhoma',
    previewTitle: 'Ditlamorago tsa Mokgwa wa Papatso',
    readyText: 'E lokile ka metsotswana',
    previewCards: [
      { label: 'Batheetse ba Hloswang', value: 'Bašomi ba toropo, 25–38, ba ba tlhokomelang boitekanelo' },
      { label: 'Kelo ya Tlhwatlhwa', value: 'Baya mo lephateng le le kwa godimo — R49 e baya sentle' },
      { label: 'Hook e e Kwa Godimo', value: '"Sediriswa se le sengwe fela se o se tlhokang go gola ga dikumo ka 10x"' },
    ],
    features: [
      { title: 'Batheetse ba Hloswang', description: 'Bona gabotlhokwa gore banni ke beng ba gago ba maleba ka tshekatsheko e e tlhagelelang ya ditlhopha.' },
      { title: 'Mokgwa wa Tlhwatlhwa', description: 'Bona dikatlholo tsa tlhwatlhwa tse di theilweng mo dateng tse di dirilweng go tshwanela le mmaraka wa gago.' },
      { title: 'Megopolo ya Dikagiso', description: 'Amogela dihuka, disenolo, le dikagiso tsa papatso tse di lokisitsweng go dirisiwa mo mabentleleng otlhe.' },
      { title: 'Leano la Kgolo', description: 'Mmila o o tletseng wa papatso go simolola ka letsatsi la ntlha go ya kwa go goleng.' },
    ],
    ctaBottom: 'A o itokantse go fenya dikgwebo tse o lwanang le tsona?',
    ctaBottomSub: 'Tsenya dintlha tsa seela sa gago mme o bone mokgwa o o tletseng ka fa tlase ga metsotswana e 30.',
    ctaBottomBtn: 'Simolola Tshekatsheko — Ke Mahala',
    footerPowered: 'Go nikilwe thata ke OpenAI GPT-4o',
  },
};

const featureIcons = [Target, TrendingUp, Zap, Sparkles];

export default function LandingPage() {
  const [lang, setLang] = useState<LangCode | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('mm_lang') as LangCode | null;
    if (stored && stored in translations) {
      setLang(stored);
    } else {
      setShowModal(true);
    }
  }, []);

  function handleLangSelect(code: LangCode) {
    localStorage.setItem('mm_lang', code);
    setLang(code);
    setShowModal(false);
  }

  function openLangModal() {
    setShowModal(true);
  }

  if (!lang) return null;

  const t = translations[lang];

  return (
    <>
      {showModal && <LanguageModal onSelect={handleLangSelect} />}
    <main className="relative min-h-screen overflow-hidden bg-[#060a14]">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="animate-orb absolute -top-40 -left-40 w-[700px] h-[700px] rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.6) 0%, transparent 70%)' }}
        />
        <div
          className="animate-orb-delay absolute -bottom-60 -right-40 w-[600px] h-[600px] rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.5) 0%, transparent 70%)' }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1px] opacity-15 dark:opacity-20"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(59,130,246,0.8), transparent)' }}
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.04) 1px, transparent 0)`,
            backgroundSize: '48px 48px',
          }}
        />
      </div>

      {/* Nav */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold text-white text-lg tracking-tight">Thuso</span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          {t.nav.map((item) => (
            <span key={item} className="text-sm text-slate-400 hover:text-white transition-colors cursor-pointer">
              {item}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={openLangModal}
            className="flex items-center gap-2 px-3 py-2 rounded-lg glass-card text-sm text-slate-300 hover:text-white transition-all hover:border-white/20"
            title="Change language"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{LANGUAGES.find((l) => l.code === lang)?.label}</span>
          </button>

          <Link
            href="/analyze"
            className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg glass-card text-sm text-slate-300 hover:text-white transition-all hover:border-white/20"
          >
            {t.nav[t.nav.length - 1]} <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 flex flex-col items-center text-center px-6 pt-20 pb-16 max-w-5xl mx-auto">
        <div className="animate-slide-up stagger-1 mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-xs text-blue-400 font-medium tracking-wide uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
          {t.heroTag}
        </div>

        <h1 className="animate-slide-up stagger-2 text-5xl md:text-7xl font-bold tracking-tight text-white leading-[1.05] text-balance mb-6">
          {t.title}
          <br />
          <span className="gradient-text-blue">{t.titleAccent}</span>
        </h1>

        <p className="animate-slide-up stagger-3 text-lg md:text-xl text-slate-400 max-w-2xl leading-relaxed mb-10 text-balance">
          {t.subtitle}
        </p>

        <div className="animate-slide-up stagger-4 flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 flex-wrap">
          <Link
            href="/analyze"
            className="group flex items-center gap-2 px-8 py-4 rounded-2xl bg-blue-500 hover:bg-blue-400 text-white font-semibold text-base transition-all duration-200 glow-blue hover:glow-blue shadow-lg"
          >
            {t.cta}
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <span className="text-sm text-slate-500">{t.noSignup}</span>
        </div>

        <div className="animate-slide-up stagger-5 flex flex-wrap justify-center gap-2 mb-4">
          {t.badges.map((badge) => (
            <span key={badge} className="px-3 py-1 rounded-full glass-card text-xs text-slate-400 font-medium">
              {badge}
            </span>
          ))}
        </div>
      </section>

      {/* Preview + Features */}
      <section className="relative z-10 px-6 pb-24 max-w-6xl mx-auto">
        <div className="animate-slide-up stagger-3 glass-card-strong rounded-3xl p-8 md:p-12 glow-blue-sm mb-16">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
            <div>
              <p className="text-xs text-blue-400 font-medium uppercase tracking-widest mb-2">{t.livePreviewLabel}</p>
              <h2 className="text-2xl font-bold text-white">{t.previewTitle}</h2>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs text-emerald-400 font-medium">{t.readyText}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {t.previewCards.map((item) => (
              <div key={item.label} className="glass-card rounded-2xl p-5">
                <p className="text-xs text-slate-500 font-medium mb-2">{item.label}</p>
                <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {t.features.map((feature, i) => {
            const Icon = featureIcons[i];
            return (
              <div
                key={feature.title}
                className={`animate-slide-up stagger-R{i + 2} glass-card rounded-2xl p-6 hover:border-white/15 transition-all duration-300 group`}
              >
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-4 group-hover:bg-blue-500/20 transition-colors">
                  <Icon className="w-5 h-5 text-blue-400" />
                </div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">{feature.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="relative z-10 px-6 pb-32 max-w-3xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 text-balance">{t.ctaBottom}</h2>
        <p className="text-slate-400 mb-8">{t.ctaBottomSub}</p>
        <Link
          href="/analyze"
          className="group inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-slate-900 text-white font-semibold text-base hover:bg-slate-800 dark:bg-white dark:text-[#060a14] dark:hover:bg-slate-100 transition-all duration-200"
        >
          {t.ctaBottomBtn}
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/5 px-6 py-8 max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-blue-500 flex items-center justify-center">
            <Sparkles className="w-3 h-3 text-white" />
          </div>
          <span className="text-sm font-medium text-slate-400">Thuso</span>
        </div>
        <p className="text-xs text-slate-600">{t.footerPowered}</p>
      </footer>
    </main>
    </>
  );
}