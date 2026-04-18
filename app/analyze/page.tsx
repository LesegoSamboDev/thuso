'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Upload, X, Sparkles, Loader as Loader2, Image as ImageIcon, Globe, ChevronRight } from 'lucide-react';
import { MarketingResults } from '@/components/marketing-results';
import type { MarketingStrategy } from '@/types/marketing';

// ─── Language config (shared with LandingPage) ───────────────────────────────

const LANGUAGES = [
  { code: 'en', label: 'English', native: 'English', flag: '🇬🇧' },
  { code: 'zu', label: 'Zulu', native: 'isiZulu', flag: '🇿🇦' },
  { code: 'tn', label: 'Tswana', native: 'Setswana', flag: '🇧🇼' },
] as const;

type LangCode = (typeof LANGUAGES)[number]['code'];

const translations: Record<LangCode, {
  back: string;
  pageTitle: string;
  pageSubtitle: string;
  imageDrop: string;
  imageBrowse: string;
  priceLabel: string;
  pricePlaceholder: string;
  descLabel: string;
  descPlaceholder: string;
  locationLabel: string;
  locationPlaceholder: string;
  submitBtn: string;
  loadingTitle: string;
  loadingSubtitle: string;
  strategyReady: string;
  yourPlan: string;
  newAnalysis: string;
  errorFallback: string;
}> = {
  en: {
    back: 'Back',
    pageTitle: 'Analyze Your Product',
    pageSubtitle: 'Fill in the details below and get your AI-generated marketing strategy.',
    imageDrop: 'Drop your product image here',
    imageBrowse: 'or click to browse — PNG, JPG, WEBP',
    priceLabel: 'Product Price',
    pricePlaceholder: '0.00',
    descLabel: 'Product Description',
    descPlaceholder: 'Describe your product — what it does, who it\'s for, what makes it unique...',
    locationLabel: 'Business Location',
    locationPlaceholder: 'e.g. Johannesburg, South Africa',
    submitBtn: 'Generate Marketing Strategy',
    loadingTitle: 'Analyzing your product…',
    loadingSubtitle: 'Our AI is crafting your marketing strategy',
    strategyReady: 'Strategy Ready',
    yourPlan: 'Your Marketing Plan',
    newAnalysis: 'New Analysis',
    errorFallback: 'Something went wrong.',
  },
  zu: {
    back: 'Emuva',
    pageTitle: 'Hlaziya Umkhiqizo Wakho',
    pageSubtitle: 'Gcwalisa imininingwane engezansi uthole isu lakho lokumaketha elikhiqizwa yi-AI.',
    imageDrop: 'Ehlisa isithombe somkhiqizo wakho lapha',
    imageBrowse: 'noma chofoza ukuze ubuke — PNG, JPG, WEBP',
    priceLabel: 'Intengo Yomkhiqizo',
    pricePlaceholder: '0.00',
    descLabel: 'Incazelo Yomkhiqizo',
    descPlaceholder: 'Chaza umkhiqizo wakho — ukwenzani, owenzelwani, futhi yini emenza abe ngeyodwa...',
    locationLabel: 'Indawo Yebhizinisi',
    locationPlaceholder: 'isb. eThekwini, iNingizimu Afrika',
    submitBtn: 'Khiqiza Isu Lokumaketha',
    loadingTitle: 'Sihlaziya umkhiqizo wakho…',
    loadingSubtitle: 'I-AI yethu ilungiselela isu lakho lokumaketha',
    strategyReady: 'Isu Selilungile',
    yourPlan: 'Uhlelo Lwakho Lokumaketha',
    newAnalysis: 'Ukuhlaziya Okusha',
    errorFallback: 'Kukhona okungahambanga kahle.',
  },
  tn: {
    back: 'Boela Morago',
    pageTitle: 'Sekaseka Seela sa Gago',
    pageSubtitle: 'Tlatsa dintlha tse di fa tlase mme o bone mokgwa wa gago wa papatso o o dirilweng ke AI.',
    imageDrop: 'Bula setshwantsho sa seela sa gago fano',
    imageBrowse: 'kgotsa klika go batla — PNG, JPG, WEBP',
    priceLabel: 'Tlhwatlhwa ya Seela',
    pricePlaceholder: '0.00',
    descLabel: 'Tlhaloso ya Seela',
    descPlaceholder: 'Tlhalosa seela sa gago — se dira eng, se direlwa mang, le se se se kgethang...',
    locationLabel: 'Lefelo la Kgwebo',
    locationPlaceholder: 'mohlala: Johannesburg, Afrika Borwa',
    submitBtn: 'Tlhama Mokgwa wa Papatso',
    loadingTitle: 'Re sekaseka seela sa gago…',
    loadingSubtitle: 'AI ya rona e a tlhama mokgwa wa gago wa papatso',
    strategyReady: 'Mokgwa o Loketse',
    yourPlan: 'Leano la Gago la Papatso',
    newAnalysis: 'Tshekatsheko e Ntšha',
    errorFallback: 'Go na le se se sa tsamayang sentle.',
  },
};

// ─── Language Modal ───────────────────────────────────────────────────────────

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

// ─── Page ─────────────────────────────────────────────────────────────────────

type FormState = 'idle' | 'loading' | 'success' | 'error';

export default function AnalyzePage() {
  const [lang, setLang] = useState<LangCode | null>(null);
  const [showModal, setShowModal] = useState(false);

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [formState, setFormState] = useState<FormState>('idle');
  const [results, setResults] = useState<MarketingStrategy | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Read language from localStorage on mount
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

  const handleImageDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) processImageFile(file);
  }, []);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processImageFile(file);
  };

  const processImageFile = (file: File) => {
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || !price || !location.trim()) return;

    setFormState('loading');
    setError(null);
    setResults(null);

    try {
      let imageBase64: string | null = null;
      if (imageFile) {
        const reader = new FileReader();
        imageBase64 = await new Promise((resolve) => {
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.readAsDataURL(imageFile);
        });
      }

      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: imageBase64, price, description, location }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || t.errorFallback);
      }

      const data = await response.json();
      setResults(data);
      setFormState('success');
    } catch (err) {
      setError(err instanceof Error ? err.message : t!.errorFallback);
      setFormState('error');
    }
  };

  const reset = () => {
    setFormState('idle');
    setResults(null);
    setError(null);
  };

  // Don't render page content until language is known
  if (!lang) return showModal ? <LanguageModal onSelect={handleLangSelect} /> : null;

  const t = translations[lang];

  return (
    <>
      {showModal && <LanguageModal onSelect={handleLangSelect} />}

      <main className="relative min-h-screen bg-[#060a14] overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="animate-orb absolute -top-60 -right-40 w-[600px] h-[600px] rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.7) 0%, transparent 70%)' }}
          />
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.03) 1px, transparent 0)`,
            backgroundSize: '48px 48px',
          }} />
        </div>

        <div className="relative z-10 min-h-screen">
          {/* Nav */}
          <nav className="flex items-center justify-between px-6 py-6 max-w-5xl mx-auto">
            <Link
              href="/"
              className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm">{t.back}</span>
            </Link>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-500 flex items-center justify-center">
                  <Sparkles className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="font-semibold text-white text-base tracking-tight">Thuso</span>
              </div>
              {/* Language switcher */}
              <button
                onClick={() => setShowModal(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg glass-card text-xs text-slate-400 hover:text-white transition-all hover:border-white/20"
                title="Change language"
              >
                <Globe className="w-3 h-3" />
                <span>{LANGUAGES.find((l) => l.code === lang)?.label}</span>
              </button>
            </div>
          </nav>

          {/* Content */}
          <div className="px-6 pb-24 max-w-2xl mx-auto">
            {formState === 'idle' || formState === 'error' ? (
              <div className="animate-slide-up">
                <div className="text-center mb-10">
                  <h1 className="text-3xl md:text-4xl font-bold text-white mb-3 tracking-tight">
                    {t.pageTitle}
                  </h1>
                  <p className="text-slate-400 text-base">{t.pageSubtitle}</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Image upload */}
                  <div
                    className={`relative rounded-2xl border-2 border-dashed transition-all duration-200 cursor-pointer ${
                      isDragging
                        ? 'border-blue-400 bg-blue-500/10'
                        : 'border-white/10 hover:border-white/20 hover:bg-white/[0.02]'
                    }`}
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleImageDrop}
                    onClick={() => !imagePreview && fileInputRef.current?.click()}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageSelect}
                    />

                    {imagePreview ? (
                      <div className="relative p-4">
                        <img
                          src={imagePreview}
                          alt="Product preview"
                          className="w-full h-48 object-contain rounded-xl"
                        />
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); removeImage(); }}
                          className="absolute top-6 right-6 w-7 h-7 rounded-full bg-black/60 border border-white/20 flex items-center justify-center text-white hover:bg-black/80 transition-colors"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                        <div className="mt-3 flex items-center gap-2">
                          <ImageIcon className="w-3.5 h-3.5 text-slate-500" />
                          <span className="text-xs text-slate-500">{imageFile?.name}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-10 px-6">
                        <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center mb-4">
                          <Upload className="w-5 h-5 text-slate-400" />
                        </div>
                        <p className="text-sm font-medium text-slate-300 mb-1">{t.imageDrop}</p>
                        <p className="text-xs text-slate-600">{t.imageBrowse}</p>
                      </div>
                    )}
                  </div>

                  {/* Price */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                      {t.priceLabel}
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm">$</span>
                      <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder={t.pricePlaceholder}
                        min="0"
                        step="0.01"
                        required
                        className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-8 pr-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 focus:bg-white/[0.05] transition-all"
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                      {t.descLabel}
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder={t.descPlaceholder}
                      required
                      rows={4}
                      className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 focus:bg-white/[0.05] transition-all resize-none"
                    />
                  </div>

                  {/* Location */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                      {t.locationLabel}
                    </label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder={t.locationPlaceholder}
                      required
                      className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 focus:bg-white/[0.05] transition-all"
                    />
                  </div>

                  {/* Error */}
                  {error && (
                    <div className="rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3">
                      <p className="text-sm text-red-400">{error}</p>
                    </div>
                  )}

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={!description.trim() || !price || !location.trim()}
                    className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-blue-500 hover:bg-blue-400 disabled:bg-white/10 disabled:text-slate-600 text-white font-semibold text-base transition-all duration-200 glow-blue-sm disabled:shadow-none"
                  >
                    <Sparkles className="w-4 h-4" />
                    {t.submitBtn}
                  </button>
                </form>
              </div>

            ) : formState === 'loading' ? (
              <div className="flex flex-col items-center justify-center py-32 animate-fade-in">
                <div className="relative mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                    <Loader2 className="w-7 h-7 text-blue-400 animate-spin" />
                  </div>
                  <div className="absolute inset-0 rounded-2xl animate-ping bg-blue-500/10" />
                </div>
                <h2 className="text-xl font-semibold text-white mb-2">{t.loadingTitle}</h2>
                <p className="text-slate-500 text-sm">{t.loadingSubtitle}</p>
                <div className="mt-8 flex gap-1.5">
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="w-2 h-2 rounded-full bg-blue-500/40 animate-pulse"
                      style={{ animationDelay: `${i * 0.2}s` }}
                    />
                  ))}
                </div>
              </div>

            ) : results ? (
              <div className="animate-scale-in">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <p className="text-xs text-blue-400 font-medium uppercase tracking-widest mb-1">{t.strategyReady}</p>
                    <h2 className="text-2xl font-bold text-white">{t.yourPlan}</h2>
                  </div>
                  <button
                    onClick={reset}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl glass-card text-sm text-slate-400 hover:text-white transition-all"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    {t.newAnalysis}
                  </button>
                </div>
                <MarketingResults strategy={results} />
              </div>
            ) : null}
          </div>
        </div>
      </main>
    </>
  );
}