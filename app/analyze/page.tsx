'use client';

import { useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import { ArrowLeft, Upload, X, Sparkles, Loader as Loader2, Image as ImageIcon } from 'lucide-react';
import { MarketingResults } from '@/components/marketing-results';
import type { MarketingStrategy } from '@/types/marketing';

type FormState = 'idle' | 'loading' | 'success' | 'error';

export default function AnalyzePage() {
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

  const handleImageDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      processImageFile(file);
    }
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
        throw new Error(data.error || 'Analysis failed. Please try again.');
      }

      const data = await response.json();
      setResults(data);
      setFormState('success');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
      setFormState('error');
    }
  };

  const reset = () => {
    setFormState('idle');
    setResults(null);
    setError(null);
  };

  return (
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
        <nav className="flex items-center justify-between px-6 py-6 max-w-5xl mx-auto">
          <Link
            href="/"
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm">Back</span>
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-500 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-semibold text-white text-base tracking-tight">MarketMind</span>
          </div>
        </nav>

        <div className="px-6 pb-24 max-w-2xl mx-auto">
          {formState === 'idle' || formState === 'error' ? (
            <div className="animate-slide-up">
              <div className="text-center mb-10">
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-3 tracking-tight">
                  Analyze Your Product
                </h1>
                <p className="text-slate-400 text-base">
                  Fill in the details below and get your AI-generated marketing strategy.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
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
                      <p className="text-sm font-medium text-slate-300 mb-1">Drop your product image here</p>
                      <p className="text-xs text-slate-600">or click to browse — PNG, JPG, WEBP</p>
                    </div>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Product Price
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm">$</span>
                    <input
                      type="number"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      required
                      className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-8 pr-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 focus:bg-white/[0.05] transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Product Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe your product — what it does, who it's for, what makes it unique..."
                    required
                    rows={4}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 focus:bg-white/[0.05] transition-all resize-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                    Business Location
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Johannesburg, South Africa"
                    required
                    className="w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 focus:bg-white/[0.05] transition-all"
                  />
                </div>

                {error && (
                  <div className="rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3">
                    <p className="text-sm text-red-400">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={!description.trim() || !price || !location.trim()}
                  className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-blue-500 hover:bg-blue-400 disabled:bg-white/10 disabled:text-slate-600 text-white font-semibold text-base transition-all duration-200 glow-blue-sm disabled:shadow-none"
                >
                  <Sparkles className="w-4 h-4" />
                  Generate Marketing Strategy
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
              <h2 className="text-xl font-semibold text-white mb-2">Analyzing your product&hellip;</h2>
              <p className="text-slate-500 text-sm">Our AI is crafting your marketing strategy</p>
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
                  <p className="text-xs text-blue-400 font-medium uppercase tracking-widest mb-1">Strategy Ready</p>
                  <h2 className="text-2xl font-bold text-white">Your Marketing Plan</h2>
                </div>
                <button
                  onClick={reset}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl glass-card text-sm text-slate-400 hover:text-white transition-all"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  New Analysis
                </button>
              </div>
              <MarketingResults strategy={results} />
            </div>
          ) : null}
        </div>
      </div>
    </main>
  );
}
